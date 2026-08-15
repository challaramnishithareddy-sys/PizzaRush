import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  markOrderPaid,
  getAdminStats,
} from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// All order routes require authentication
router.use(authenticate);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/admin/stats', requireAdmin, getAdminStats);
router.get('/', requireAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', requireAdmin, updateOrderStatus);
router.post('/:id/pay', markOrderPaid);

export default router;
