import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().default('mongodb+srv://user:pk3571830_db_@cluster0.4ggwaat.mongodb.net/pizzahub?appName=Cluster0'),
  JWT_SECRET: z.string().default('pizzahub_dev_secret_key_2024_change_in_prod'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  RAZORPAY_KEY_ID: z.string().optional().default(''),
  RAZORPAY_KEY_SECRET: z.string().optional().default(''),
  CLIENT_URL: z.string().default('http://localhost:5173'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Environment configuration error. Check your .env file.');
  }
  return {
    ...result.data,
    IS_PRODUCTION: result.data.NODE_ENV === 'production',
    IS_DEVELOPMENT: result.data.NODE_ENV === 'development',
    IS_TEST: result.data.NODE_ENV === 'test',
  };
};

export const env = parseEnv();
