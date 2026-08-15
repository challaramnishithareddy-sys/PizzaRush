import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Available size variants with price multipliers.
 */
export interface ISizeVariant {
  size: 'small' | 'medium' | 'large';
  price: number;
}

/**
 * Pizza document interface.
 */
export interface IPizza extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: 'veg' | 'non-veg' | 'specialty' | string;
  categoryRef?: mongoose.Types.ObjectId;
  basePrice: number;          // Base price in rupees
  sizes: ISizeVariant[];      // All size variants
  crusts: string[];           // Available crust options
  toppings: { name: string; price: number }[];
  image: string;              // URL or path to image
  rating: number;             // 0–5 average
  totalRatings: number;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const sizeVariantSchema = new Schema<ISizeVariant>(
  {
    size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const toppingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const pizzaSchema = new Schema<IPizza>(
  {
    name: {
      type: String,
      required: [true, 'Pizza name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categoryRef: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    basePrice: { type: Number, required: true, min: 0 },
    sizes: {
      type: [sizeVariantSchema],
      default: [],
    },
    crusts: {
      type: [String],
      default: ['thin', 'thick', 'stuffed'],
    },
    toppings: { type: [toppingSchema], default: [] },
    image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    tags: [String],
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

// Auto-generate slug before save if missing
pizzaSchema.pre('save', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Search & filter indexes
pizzaSchema.index({ name: 'text', description: 'text', tags: 'text' });
pizzaSchema.index({ category: 1, isAvailable: 1 });

export const Pizza: Model<IPizza> = mongoose.model<IPizza>('Pizza', pizzaSchema);
