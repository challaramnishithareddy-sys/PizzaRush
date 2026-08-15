import { Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

// Lazy-load Razorpay to avoid crash if keys are not configured
let razorpayInstance: InstanceType<typeof import('razorpay')> | null = null;

const getRazorpay = async () => {
  if (!razorpayInstance) {
    const Razorpay = (await import('razorpay')).default;
    razorpayInstance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * POST /api/payments/create-order
 * Creates a Razorpay order for the given amount (in rupees).
 */
export const createRazorpayOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { amount, currency = 'INR', orderId } = z
      .object({
        amount: z.number().min(1),
        currency: z.string().default('INR'),
        orderId: z.string().optional(),
      })
      .parse(req.body);

    if (!env.RAZORPAY_KEY_ID || env.RAZORPAY_KEY_ID.includes('YOUR')) {
      // Demo mode — return a mock order for development without real keys
      res.status(200).json(
        new ApiResponse(200, 'Razorpay order created (demo mode)', {
          id: `order_demo_${Date.now()}`,
          amount: amount * 100,
          currency,
          key: env.RAZORPAY_KEY_ID,
          isDemoMode: true,
        })
      );
      return;
    }

    const razorpay = await getRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay uses paise
      currency,
      receipt: orderId || `receipt_${Date.now()}`,
      notes: {
        userId: req.user!._id,
      },
    });

    res.status(200).json(
      new ApiResponse(200, 'Razorpay order created', {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: env.RAZORPAY_KEY_ID,
      })
    );
  }
);

/**
 * POST /api/payments/verify
 * Verifies Razorpay payment signature (HMAC-SHA256).
 */
export const verifyPayment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = z
      .object({
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
      })
      .parse(req.body);

    // Demo mode — skip verification
    if (razorpay_order_id.startsWith('order_demo_')) {
      res.status(200).json(
        new ApiResponse(200, 'Payment verified (demo mode)', {
          verified: true,
          paymentId: razorpay_payment_id,
        })
      );
      return;
    }

    const generatedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      throw new AppError('Payment verification failed. Invalid signature.', 400);
    }

    res.status(200).json(
      new ApiResponse(200, 'Payment verified successfully', {
        verified: true,
        paymentId: razorpay_payment_id,
      })
    );
  }
);
