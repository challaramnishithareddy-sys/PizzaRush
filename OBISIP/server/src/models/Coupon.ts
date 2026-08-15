import mongoose, { Document, Schema, Model } from 'mongoose';

export type DiscountType = 'percentage' | 'fixed';

export interface ICoupon extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;               // Percentage (1-100) or fixed amount in rupees/cents
  minimumOrderAmount: number;          // Minimum subtotal required
  maximumDiscount?: number;            // Cap on percentage discount
  startsAt: Date;
  expiresAt: Date;
  usageLimit?: number;                 // Total global usage limit
  usageCount: number;                  // Current global usage count
  perUserLimit: number;                // Max uses per user
  applicableCategories?: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isValid(): boolean;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Coupon description is required'],
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [1, 'Discount value must be greater than 0'],
      validate: {
        validator: function (this: ICoupon, val: number) {
          if (this.discountType === 'percentage') {
            return val <= 100;
          }
          return true;
        },
        message: 'Percentage discount cannot exceed 100%',
      },
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maximumDiscount: {
      type: Number,
      min: 0,
    },
    startsAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    perUserLimit: {
      type: Number,
      default: 1,
      min: 1,
    },
    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

couponSchema.index({ code: 1, isActive: 1, expiresAt: 1 });

couponSchema.methods.isValid = function (): boolean {
  const now = new Date();
  if (!this.isActive) return false;
  if (this.startsAt > now) return false;
  if (this.expiresAt < now) return false;
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false;
  return true;
};

export const Coupon: Model<ICoupon> = mongoose.model<ICoupon>('Coupon', couponSchema);
