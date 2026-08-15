import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://user:pk3571830_db_@cluster0.4ggwaat.mongodb.net/pizzahub?appName=Cluster0';

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['veg', 'non-veg', 'specialty'], required: true },
  basePrice: { type: Number, required: true },
  sizes: [{
    size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    price: { type: Number, required: true }
  }],
  crusts: [{ type: String, default: ['thin', 'thick', 'stuffed'] }],
  toppings: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  image: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  totalRatings: { type: Number, default: 120 },
  tags: [{ type: String }]
}, { timestamps: true });

const Pizza = mongoose.model('Pizza', pizzaSchema);

const samplePizzas = [
  // --- VEGETARIAN ---
  {
    name: 'Margherita Classic',
    description: 'Classic delight with 100% real mozzarella cheese & fresh basil leaves on rich tomato sauce.',
    category: 'veg',
    basePrice: 199,
    sizes: [
      { size: 'small', price: 199 },
      { size: 'medium', price: 349 },
      { size: 'large', price: 499 }
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Extra Cheese', price: 50 },
      { name: 'Black Olives', price: 35 },
      { name: 'Mushrooms', price: 40 }
    ],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    isFeatured: true,
    isAvailable: true,
    rating: 4.8,
    totalRatings: 340,
    tags: ['bestseller', 'classic', 'veg']
  },
  {
    name: 'Paneer Tikka Supreme',
    description: 'Succulent spiced paneer tikka cubes, capsicum, red onions, & juicy tomatoes with mint mayo drizzle.',
    category: 'veg',
    basePrice: 279,
    sizes: [
      { size: 'small', price: 279 },
      { size: 'medium', price: 449 },
      { size: 'large', price: 629 }
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Extra Paneer', price: 60 },
      { name: 'Jalapenos', price: 35 },
      { name: 'Sweet Corn', price: 30 }
    ],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    isFeatured: true,
    isAvailable: true,
    rating: 4.9,
    totalRatings: 420,
    tags: ['spicy', 'paneer', 'indian-flavor']
  },
  {
    name: 'Veggie Paradise',
    description: 'Loaded with golden corn, black olives, crisp capsicum, red paprika, and juicy tomatoes.',
    category: 'veg',
    basePrice: 249,
    sizes: [
      { size: 'small', price: 249 },
      { size: 'medium', price: 399 },
      { size: 'large', price: 569 }
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Mushrooms', price: 40 },
      { name: 'Extra Cheese', price: 50 }
    ],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    isFeatured: false,
    isAvailable: true,
    rating: 4.6,
    totalRatings: 180,
    tags: ['loaded', 'healthy', 'veg']
  },

  // --- NON-VEGETARIAN ---
  {
    name: 'Chicken Pepperoni Passion',
    description: 'Generous portion of spicy chicken pepperoni topped with extra mozzarella cheese.',
    category: 'non-veg',
    basePrice: 329,
    sizes: [
      { size: 'small', price: 329 },
      { size: 'medium', price: 529 },
      { size: 'large', price: 749 }
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Extra Pepperoni', price: 70 },
      { name: 'Jalapenos', price: 35 }
    ],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    isFeatured: true,
    isAvailable: true,
    rating: 4.9,
    totalRatings: 510,
    tags: ['pepperoni', 'bestseller', 'non-veg']
  },
  {
    name: 'Fiery Chicken Tikka',
    description: 'Tender chicken tikka chunks, hot red paprika, green chillies, & red onions on a spicy makhani sauce.',
    category: 'non-veg',
    basePrice: 299,
    sizes: [
      { size: 'small', price: 299 },
      { size: 'medium', price: 489 },
      { size: 'large', price: 689 }
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Extra Chicken', price: 65 },
      { name: 'Extra Cheese', price: 50 }
    ],
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&q=80',
    isFeatured: false,
    isAvailable: true,
    rating: 4.7,
    totalRatings: 290,
    tags: ['spicy', 'chicken', 'desi-flavor']
  },
  {
    name: 'BBQ Smoked Chicken',
    description: 'Smoky grilled chicken pieces tossed in sweet BBQ sauce with red onions and bell peppers.',
    category: 'non-veg',
    basePrice: 319,
    sizes: [
      { size: 'small', price: 319 },
      { size: 'medium', price: 509 },
      { size: 'large', price: 719 }
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'BBQ Dip', price: 30 },
      { name: 'Extra Cheese', price: 50 }
    ],
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    isFeatured: true,
    isAvailable: true,
    rating: 4.8,
    totalRatings: 310,
    tags: ['bbq', 'smoky', 'non-veg']
  },

  // --- SPECIALTY ---
  {
    name: 'Chef’s Truffle Mushroom Fusion',
    description: 'Wild button mushrooms, caramelized onions, garlic butter sauce, finished with a truffle oil drizzle.',
    category: 'specialty',
    basePrice: 359,
    sizes: [
      { size: 'small', price: 359 },
      { size: 'medium', price: 579 },
      { size: 'large', price: 799 }
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Truffle Oil Extra', price: 80 },
      { name: 'Parmesan Shavings', price: 60 }
    ],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    isFeatured: true,
    isAvailable: true,
    rating: 5.0,
    totalRatings: 150,
    tags: ['gourmet', 'chef-special', 'truffle']
  },
  {
    name: 'Four Cheese Blast (Quattro Formaggi)',
    description: 'Rich combination of Mozzarella, Cheddar, Gouda, and Cream Cheese with Italian herbs.',
    category: 'specialty',
    basePrice: 339,
    sizes: [
      { size: 'small', price: 339 },
      { size: 'medium', price: 549 },
      { size: 'large', price: 769 }
    ],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [
      { name: 'Chilli Flakes Pack', price: 15 },
      { name: 'Oregano Pack', price: 15 }
    ],
    image: 'https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=600&q=80',
    isFeatured: false,
    isAvailable: true,
    rating: 4.8,
    totalRatings: 230,
    tags: ['cheesy', 'four-cheese', 'specialty']
  }
];

async function seedPizzas() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas!');

    console.log('Clearing existing pizza menu items...');
    await Pizza.deleteMany({});

    console.log('Inserting fresh sample pizzas in INR...');
    await Pizza.insertMany(samplePizzas);

    console.log('✅ Successfully seeded', samplePizzas.length, 'pizzas into MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu items:', error);
    process.exit(1);
  }
}

seedPizzas();
