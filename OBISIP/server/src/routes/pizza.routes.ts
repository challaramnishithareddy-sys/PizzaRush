import { Router } from 'express';
import {
  getAllPizzas,
  getFeaturedPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
  toggleAvailability,
} from '../controllers/pizza.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// Public routes
router.get('/', getAllPizzas);
router.get('/featured', getFeaturedPizzas);
router.get('/:id', getPizzaById);

// Admin-only routes
router.post('/', authenticate, requireAdmin, createPizza);
router.put('/:id', authenticate, requireAdmin, updatePizza);
router.delete('/:id', authenticate, requireAdmin, deletePizza);
router.patch('/:id/toggle-availability', authenticate, requireAdmin, toggleAvailability);

export default router;
