import mongoose, { Document, Schema, Model } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

/**
 * Individual item within an order.
 * Prices are captured at order time to prevent price drift.
 */
export interface IOrderItem {
  pizza: mongoose.Types.ObjectId | string;
  pizzaName: string;
  size: 'small' | 'medium' | 'large';
  crust: string;
  toppings: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Delivery address captured at order time.
 */
export interface IDeliveryAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

/**
 * Status history entry for real-time tracking.
 */
export interface IStatusEvent {
  status: OrderStatus;
  timestamp: Date;
  message: string;
}

/**
 * Order document interface.
 */
export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  deliveryAddress: IDeliveryAddress;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  taxAmount?: number;
  totalAmount: number;
  couponCode?: string;
  status: OrderStatus;
  statusHistory: IStatusEvent[];
  paymentId?: string;
  razorpayOrderId?: string;
  isPaid: boolean;
  estimatedDelivery: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    pizza: { type: Schema.Types.Mixed, required: true },
    pizzaName: { type: String, required: true },
    size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    crust: { type: String, required: true },
    toppings: [String],
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const deliveryAddressSchema = new Schema<IDeliveryAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const statusEventSchema = new Schema<IStatusEvent>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    message: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: { type: [orderItemSchema], required: true },
    deliveryAddress: { type: deliveryAddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 49 },
    discount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    couponCode: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: { type: [statusEventSchema], default: [] },
    paymentId: String,
    razorpayOrderId: String,
    isPaid: { type: Boolean, default: false },
    estimatedDelivery: {
      type: Date,
      default: () => new Date(Date.now() + 45 * 60 * 1000),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        const r = ret as Record<string, unknown>;
        delete r.__v;
        return r;
      },
    },
  }
);

// Auto-generate order number before validation
orderSchema.pre('validate', async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `PH-${timestamp}-${random}`;
  }
  next();
});

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });

export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);
