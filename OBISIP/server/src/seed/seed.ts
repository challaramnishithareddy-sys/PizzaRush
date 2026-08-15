/**
 * Database Seed Script
 * Run: npm run seed
 * Populates the database with sample categories, pizzas, users, coupons, reviews, and inventory items.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Pizza, Order, Category, Coupon, Review, Inventory } from '../models';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzahub';

const sampleCategories = [
  {
    name: 'Veg Pizzas',
    slug: 'veg',
    description: 'Fresh vegetarian pizzas loaded with garden vegetables and premium cheeses.',
    icon: '🥬',
    displayOrder: 1,
    isFeatured: true,
  },
  {
    name: 'Non-Veg Pizzas',
    slug: 'non-veg',
    description: 'Succulent chicken, pepperoni, and savory meat topping pizzas.',
    icon: '🍗',
    displayOrder: 2,
    isFeatured: true,
  },
  {
    name: 'Specialty Chef Specials',
    slug: 'specialty',
    description: 'Exquisite artisan gourmet pizzas crafted by our master chefs.',
    icon: '⭐',
    displayOrder: 3,
    isFeatured: true,
  },
];

const sampleCoupons = [
  {
    code: 'PIZZA20',
    description: 'Get 20% OFF on all orders above ₹499',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrderAmount: 499,
    maximumDiscount: 200,
    startsAt: new Date(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    usageLimit: 1000,
    perUserLimit: 3,
    isActive: true,
  },
  {
    code: 'FIRST50',
    description: 'Flat ₹50 OFF on your first order',
    discountType: 'fixed',
    discountValue: 50,
    minimumOrderAmount: 299,
    startsAt: new Date(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    usageLimit: 5000,
    perUserLimit: 1,
    isActive: true,
  },
  {
    code: 'FREESHIP',
    description: 'Free delivery on orders above ₹399',
    discountType: 'fixed',
    discountValue: 49,
    minimumOrderAmount: 399,
    startsAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    usageLimit: 2000,
    perUserLimit: 5,
    isActive: true,
  },
];

const sampleInventory = [
  {
    itemName: 'Mozzarella Cheese',
    sku: 'ING-CHE-001',
    category: 'cheese',
    quantityInStock: 50,
    unit: 'kg',
    reorderLevel: 10,
    reorderQuantity: 30,
    costPerUnit: 350,
    supplier: 'DairyFresh Foods',
  },
  {
    itemName: 'Thin Crust Base (Medium)',
    sku: 'ING-CRU-001',
    category: 'crust',
    quantityInStock: 200,
    unit: 'units',
    reorderLevel: 30,
    reorderQuantity: 100,
    costPerUnit: 25,
    supplier: 'Artisan Bakery',
  },
  {
    itemName: 'San Marzano Pizza Sauce',
    sku: 'ING-SAU-001',
    category: 'sauce',
    quantityInStock: 40,
    unit: 'liters',
    reorderLevel: 8,
    reorderQuantity: 25,
    costPerUnit: 180,
    supplier: 'Italian Imports Co.',
  },
  {
    itemName: 'Pepperoni Slices',
    sku: 'ING-TOP-001',
    category: 'topping',
    quantityInStock: 25,
    unit: 'kg',
    reorderLevel: 5,
    reorderQuantity: 15,
    costPerUnit: 600,
    supplier: 'Gourmet Meats Ltd',
  },
];

const samplePizzas = [
  {
    name: 'Margherita Classic',
    slug: 'margherita-classic',
    description: 'The timeless classic with fresh San Marzano tomato sauce, mozzarella fior di latte, and fragrant basil leaves.',
    category: 'veg',
    basePrice: 199,
    sizes: [
      { size: 'small', price: 199 },
      { size: 'medium', price: 299 },
      { size: 'large', price: 399 },
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Extra Cheese', price: 50 },
      { name: 'Olives', price: 30 },
      { name: 'Jalapeños', price: 25 },
      { name: 'Sun-dried Tomatoes', price: 40 },
    ],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80',
    rating: 4.8,
    totalRatings: 1240,
    isFeatured: true,
    tags: ['classic', 'vegetarian', 'bestseller'],
  },
  {
    name: 'BBQ Chicken Fiesta',
    slug: 'bbq-chicken-fiesta',
    description: 'Smoky BBQ sauce base topped with grilled chicken strips, caramelized onions, bell peppers, and smoked gouda.',
    category: 'non-veg',
    basePrice: 299,
    sizes: [
      { size: 'small', price: 299 },
      { size: 'medium', price: 429 },
      { size: 'large', price: 549 },
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Extra Chicken', price: 80 },
      { name: 'Extra Cheese', price: 50 },
      { name: 'Bacon Bits', price: 60 },
    ],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
    rating: 4.7,
    totalRatings: 980,
    isFeatured: true,
    tags: ['bbq', 'chicken', 'spicy'],
  },
  {
    name: 'Paneer Tikka Blast',
    slug: 'paneer-tikka-blast',
    description: 'Tandoori-spiced paneer cubes on a creamy tikka masala base with colorful capsicums and onions.',
    category: 'veg',
    basePrice: 259,
    sizes: [
      { size: 'small', price: 259 },
      { size: 'medium', price: 369 },
      { size: 'large', price: 479 },
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Extra Paneer', price: 70 },
      { name: 'Extra Cheese', price: 50 },
      { name: 'Green Chutney Drizzle', price: 20 },
    ],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
    rating: 4.6,
    totalRatings: 756,
    isFeatured: true,
    tags: ['indian', 'paneer', 'spicy', 'vegetarian'],
  },
  {
    name: 'Pepperoni Paradise',
    slug: 'pepperoni-paradise',
    description: 'A carnivore\'s dream — heaping pepperoni slices on rich tomato sauce with stretchy mozzarella.',
    category: 'non-veg',
    basePrice: 279,
    sizes: [
      { size: 'small', price: 279 },
      { size: 'medium', price: 399 },
      { size: 'large', price: 519 },
    ],
    crusts: ['thin', 'thick'],
    toppings: [
      { name: 'Extra Pepperoni', price: 70 },
      { name: 'Extra Cheese', price: 50 },
      { name: 'Mushrooms', price: 30 },
    ],
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&q=80',
    rating: 4.9,
    totalRatings: 1480,
    isFeatured: true,
    tags: ['pepperoni', 'classic', 'bestseller'],
  },
];

const seedDatabase = async (): Promise<void> => {

  if (MONGODB_URI.includes('<db_password>')) {
    console.error('❌ MONGODB_URI contains "<db_password>" placeholder!');
    console.error('👉 Please edit pizza/server/.env and replace <db_password> with your actual MongoDB Atlas password.');
    console.error('👉 Or use local MongoDB: MONGODB_URI=mongodb://127.0.0.1:27017/pizzahub');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data safely
    await Promise.all([
      Category.deleteMany({}),
      Pizza.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
      Inventory.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing collections');

    // 1. Seed Categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`📁 Seeded ${categories.length} categories`);

    // Map category IDs to pizza category fields
    const categoryMap = new Map(categories.map((cat) => [cat.slug, cat._id]));

    // 2. Seed Pizzas
    const pizzasWithCatRef = samplePizzas.map((p) => ({
      ...p,
      categoryRef: categoryMap.get(p.category),
    }));
    const pizzas = await Pizza.insertMany(pizzasWithCatRef);
    console.log(`🍕 Seeded ${pizzas.length} pizzas`);

    // 3. Seed Coupons
    const coupons = await Coupon.insertMany(sampleCoupons);
    console.log(`🎟️  Seeded ${coupons.length} coupons`);

    // 5. Seed Inventory
    const inventoryItems = await Inventory.insertMany(sampleInventory);
    console.log(`📦 Seeded ${inventoryItems.length} inventory items`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Coupons Available:    PIZZA20, FIRST50, FREESHIP');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
