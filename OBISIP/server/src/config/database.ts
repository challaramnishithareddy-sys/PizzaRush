import mongoose from 'mongoose';
import { env } from './env';

/**
 * Connects to MongoDB with optimized pool size, timeouts, and event listeners.
 */
let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      bufferCommands: false, // Disable Mongoose buffering for serverless
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log(`✅ MongoDB connected: ${connection.connection.host} (${connection.connection.name})`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

// Connection status listeners
mongoose.connection.on('connected', () => {
  console.log('ℹ️  Mongoose connected to DB');
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB event error:', err);
});

// Graceful shutdown on process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔒 MongoDB connection closed through app termination');
  process.exit(0);
});
