import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import pizzaRoutes from './routes/pizza.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import seedRoutes from './routes/seed.routes';

const app = express();

// ── Security & Perf Middleware ────────────────────────────────────────────────

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const allowed = [
        env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:4173',
      ];
      // Allow any *.vercel.app domain for preview deployments
      const isVercel = origin.endsWith('.vercel.app') || origin.includes('vercel.app');
      if (allowed.includes(origin) || isVercel) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts. Please try again later.' },
});

if (!env.IS_PRODUCTION) {
  app.use('/api', generalLimiter);
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
}

// ── Static Files (uploaded images) ───────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── API Routes ────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', seedRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'PizzaHub API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
