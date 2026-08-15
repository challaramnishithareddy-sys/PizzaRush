import { Router } from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;
