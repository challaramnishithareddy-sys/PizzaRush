import mongoose, { Document, Schema, Model } from 'mongoose';

export type InventoryCategory =
  | 'crust'
  | 'topping'
  | 'sauce'
  | 'cheese'
  | 'beverage'
  | 'packaging'
  | 'other';

export interface IInventory extends Document {
  _id: mongoose.Types.ObjectId;
  itemName: string;
  sku: string;
  category: InventoryCategory;
  quantityInStock: number;
  reservedQuantity: number;
  availableQuantity: number;          // Virtual: quantityInStock - reservedQuantity
  unit: string;                        // 'kg', 'grams', 'liters', 'units'
  reorderLevel: number;
  reorderQuantity: number;
  costPerUnit: number;
  supplier?: string;
  lastRestockedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      unique: true,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['crust', 'topping', 'sauce', 'cheese', 'beverage', 'packaging', 'other'],
      required: true,
    },
    quantityInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      default: 'units',
    },
    reorderLevel: {
      type: Number,
      default: 10,
      min: 0,
    },
    reorderQuantity: {
      type: Number,
      default: 50,
      min: 0,
    },
    costPerUnit: {
      type: Number,
      default: 0,
      min: 0,
    },
    supplier: {
      type: String,
      trim: true,
    },
    lastRestockedAt: {
      type: Date,
      default: Date.now,
    },
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

// Virtual property for available quantity
inventorySchema.virtual('availableQuantity').get(function (this: IInventory) {
  return Math.max(0, this.quantityInStock - this.reservedQuantity);
});

inventorySchema.index({ category: 1, isActive: 1 });

export const Inventory: Model<IInventory> = mongoose.model<IInventory>('Inventory', inventorySchema);
