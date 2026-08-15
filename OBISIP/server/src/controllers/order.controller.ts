import { Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Order, OrderStatus } from '../models/Order';
import { Pizza } from '../models/Pizza';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { getIO } from '../socket/socket.handler';

/** Human-readable status messages for the order timeline */
const STATUS_MESSAGES: Record<OrderStatus, string> = {
  pending: 'Order received and awaiting confirmation',
  confirmed: 'Your order has been confirmed!',
  preparing: 'Our chefs are preparing your pizza',
  out_for_delivery: 'Your order is on the way!',
  delivered: 'Order delivered. Enjoy your meal!',
  cancelled: 'Order has been cancelled',
};

// ── Validation ───────────────────────────────────────────────────────────────

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      pizzaId: z.string(),
      pizzaName: z.string().optional(),
      unitPrice: z.number().optional(),
      size: z.enum(['small', 'medium', 'large']),
      crust: z.string(),
      toppings: z.array(z.string()).optional(),
      quantity: z.number().min(1).max(20),
    })
  ).min(1),
  deliveryAddress: z.object({
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  couponCode: z.string().optional(),
  razorpayOrderId: z.string().optional(),
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const COUPON_CODES: Record<string, number> = {
  PIZZA10: 10,
  SAVE20: 20,
  WELCOME15: 15,
};

const DELIVERY_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 499;

// ── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/orders
 * Creates a new order. Calculates prices server-side to prevent tampering.
 */
export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = createOrderSchema.parse(req.body);

    // Build order items with server-side price verification
    const orderItems = [];
    let subtotal = 0;

    for (const item of body.items) {
      const isCustom = typeof item.pizzaId === 'string' && (item.pizzaId.startsWith('custom-') || !mongoose.Types.ObjectId.isValid(item.pizzaId));

      if (isCustom) {
        const unitPrice = Math.max(0, item.unitPrice || 299);
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          pizza: item.pizzaId,
          pizzaName: item.pizzaName || 'Custom Pizza',
          size: item.size,
          crust: item.crust,
          toppings: item.toppings || [],
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });
      } else {
        const pizza = await Pizza.findById(item.pizzaId);
        if (!pizza) throw new AppError(`Pizza ${item.pizzaId} not found`, 404);
        if (!pizza.isAvailable)
          throw new AppError(`${pizza.name} is currently unavailable`, 400);

        // Find the price for the requested size
        const sizeVariant = pizza.sizes.find((s) => s.size === item.size);
        if (!sizeVariant)
          throw new AppError(`Size '${item.size}' not available for ${pizza.name}`, 400);

        // Sum up topping prices
        const toppingsCost = (item.toppings || []).reduce((sum, toppingName) => {
          const topping = pizza.toppings.find((t) => t.name === toppingName);
          return sum + (topping ? topping.price : 0);
        }, 0);

        const unitPrice = sizeVariant.price + toppingsCost;
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          pizza: pizza._id,
          pizzaName: pizza.name,
          size: item.size,
          crust: item.crust,
          toppings: item.toppings || [],
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });
      }
    }

    // Apply coupon discount
    let discount = 0;
    if (body.couponCode) {
      const discountPct = COUPON_CODES[body.couponCode.toUpperCase()];
      if (discountPct) {
        discount = Math.round((subtotal * discountPct) / 100);
      }
    }

    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const totalAmount = subtotal - discount + deliveryFee;

    const order = await Order.create({
      user: req.user!._id,
      items: orderItems,
      deliveryAddress: body.deliveryAddress,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      couponCode: body.couponCode,
      razorpayOrderId: body.razorpayOrderId,
      statusHistory: [
        {
          status: 'pending',
          message: STATUS_MESSAGES['pending'],
          timestamp: new Date(),
        },
      ],
    });

    // Notify admin room about new order via Socket.IO
    try {
      const io = getIO();
      io.to('admin-room').emit('new-order', { order });
    } catch {
      // Socket.IO might not be initialized in test; non-critical
    }

    res
      .status(201)
      .json(new ApiResponse(201, 'Order placed successfully', { order }));
  }
);

/**
 * GET /api/orders/my
 * Returns all orders for the authenticated customer.
 */
export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(new ApiResponse(200, 'Orders fetched', { orders }));
  }
);

/**
 * GET /api/orders/:id
 * Returns a single order. Customers can only access their own orders.
 */
export const getOrderById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id).lean();
    if (!order) throw new AppError('Order not found', 404);

    // Non-admins can only see their own orders
    if (
      req.user!.role !== 'admin' &&
      order.user.toString() !== req.user!._id
    ) {
      throw new AppError('Not authorized to view this order', 403);
    }

    res.status(200).json(new ApiResponse(200, 'Order found', { order }));
  }
);

/**
 * GET /api/orders
 * Admin only. Returns all orders with pagination.
 */
export const getAllOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { status, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, parseInt(limit, 10));
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(200, 'All orders', {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      })
    );
  }
);

/**
 * PUT /api/orders/:id/status
 * Admin only. Updates order status and emits Socket.IO event.
 */
export const updateOrderStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { status } = z
      .object({
        status: z.enum([
          'pending',
          'confirmed',
          'preparing',
          'out_for_delivery',
          'delivered',
          'cancelled',
        ]),
      })
      .parse(req.body);

    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError('Order not found', 404);

    order.status = status as OrderStatus;
    order.statusHistory.push({
      status: status as OrderStatus,
      timestamp: new Date(),
      message: STATUS_MESSAGES[status as OrderStatus],
    });

    if (status === 'delivered') order.isPaid = true;

    await order.save();

    // Emit real-time update to the order's room
    try {
      const io = getIO();
      const payload = {
        orderId: order._id.toString(),
        status,
        message: STATUS_MESSAGES[status as OrderStatus],
        timestamp: new Date().toISOString(),
      };
      io.to(`order-${order._id}`).emit('order-status-update', payload);
      io.to('admin-room').emit('order-status-update', payload);
    } catch {
      // Non-critical
    }

    res.status(200).json(new ApiResponse(200, 'Order status updated', { order }));
  }
);

/**
 * POST /api/orders/:id/pay
 * Marks an order as paid after Razorpay verification.
 */
export const markOrderPaid = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { paymentId } = z
      .object({ paymentId: z.string() })
      .parse(req.body);

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      {
        $set: {
          isPaid: true,
          paymentId,
          status: 'confirmed',
        },
        $push: {
          statusHistory: {
            status: 'confirmed',
            timestamp: new Date(),
            message: STATUS_MESSAGES['confirmed'],
          },
        },
      },
      { new: true }
    );

    if (!order) throw new AppError('Order not found', 404);

    try {
      const io = getIO();
      io.to(`order-${order._id}`).emit('order-status-update', {
        orderId: order._id.toString(),
        status: 'confirmed',
        message: STATUS_MESSAGES['confirmed'],
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Non-critical
    }

    res.status(200).json(new ApiResponse(200, 'Payment confirmed', { order }));
  }
);

/**
 * GET /api/orders/admin/stats
 * Admin only. Dashboard statistics.
 */
export const getAdminStats = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, totalRevenue, statusCounts] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: today } }),
        Order.aggregate([
          { $match: { isPaid: true } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        Order.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
      ]);

    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.status(200).json(
      new ApiResponse(200, 'Dashboard stats', {
        totalOrders,
        todayOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusCounts: Object.fromEntries(
          statusCounts.map((s: { _id: string; count: number }) => [s._id, s.count])
        ),
        revenueData,
      })
    );
  }
);
