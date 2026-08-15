import { Router } from 'express';
import { Pizza } from '../models';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const samplePizzas = [
  {
    name: 'Margherita Classic',
    slug: 'margherita-classic',
    description: '100% real mozzarella cheese & fresh basil leaves on rich tomato sauce.',
    category: 'veg',
    basePrice: 199,
    sizes: [{ size: 'small', price: 199 }, { size: 'medium', price: 349 }, { size: 'large', price: 499 }],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [{ name: 'Extra Cheese', price: 50 }, { name: 'Olives', price: 35 }],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    rating: 4.8,
    totalRatings: 340,
    isFeatured: true,
    tags: ['bestseller', 'classic', 'veg']
  },
  {
    name: 'Paneer Tikka Supreme',
    slug: 'paneer-tikka-supreme',
    description: 'Spiced paneer tikka cubes, capsicum, red onions, & juicy tomatoes with mint mayo.',
    category: 'veg',
    basePrice: 279,
    sizes: [{ size: 'small', price: 279 }, { size: 'medium', price: 449 }, { size: 'large', price: 629 }],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [{ name: 'Extra Paneer', price: 60 }, { name: 'Jalapenos', price: 35 }],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    rating: 4.9,
    totalRatings: 420,
    isFeatured: true,
    tags: ['spicy', 'paneer', 'veg']
  },
  {
    name: 'Chicken Pepperoni Passion',
    slug: 'chicken-pepperoni-passion',
    description: 'Generous portion of spicy chicken pepperoni topped with extra mozzarella cheese.',
    category: 'non-veg',
    basePrice: 329,
    sizes: [{ size: 'small', price: 329 }, { size: 'medium', price: 529 }, { size: 'large', price: 749 }],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [{ name: 'Extra Pepperoni', price: 70 }, { name: 'Extra Cheese', price: 50 }],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    rating: 4.9,
    totalRatings: 510,
    isFeatured: true,
    tags: ['pepperoni', 'bestseller', 'non-veg']
  },
  {
    name: 'Fiery Chicken Tikka',
    slug: 'fiery-chicken-tikka',
    description: 'Tender chicken tikka chunks, hot red paprika, green chillies, & red onions.',
    category: 'non-veg',
    basePrice: 299,
    sizes: [{ size: 'small', price: 299 }, { size: 'medium', price: 489 }, { size: 'large', price: 689 }],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [{ name: 'Extra Chicken', price: 65 }, { name: 'Extra Cheese', price: 50 }],
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&q=80',
    rating: 4.7,
    totalRatings: 290,
    isFeatured: false,
    tags: ['spicy', 'chicken', 'non-veg']
  },
  {
    name: 'Chef’s Truffle Mushroom Fusion',
    slug: 'truffle-mushroom-fusion',
    description: 'Wild button mushrooms, caramelized onions, garlic butter, truffle oil drizzle.',
    category: 'specialty',
    basePrice: 359,
    sizes: [{ size: 'small', price: 359 }, { size: 'medium', price: 579 }, { size: 'large', price: 799 }],
    crusts: ['thin', 'thick', 'stuffed'],
    toppings: [{ name: 'Truffle Oil Extra', price: 80 }, { name: 'Parmesan', price: 60 }],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    rating: 5.0,
    totalRatings: 150,
    isFeatured: true,
    tags: ['gourmet', 'chef-special', 'specialty']
  }
];

router.get('/setup-seed', asyncHandler(async (_req, res) => {
  await Pizza.deleteMany({});
  const pizzas = await Pizza.insertMany(samplePizzas);

  res.status(200).json(new ApiResponse(200, 'Database seeded successfully via API!', { count: pizzas.length }));
}));

export default router;
