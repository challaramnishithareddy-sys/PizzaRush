import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { initSocketHandlers } from './socket/socket.handler';

const startServer = async (): Promise<void> => {
  // 1. Connect to MongoDB
  await connectDatabase();

  // 2. Create HTTP server from Express app
  const httpServer = http.createServer(app);

  // 3. Attach Socket.IO to the HTTP server
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // 4. Register Socket.IO event handlers
  initSocketHandlers(io);

  // 5. Start listening
  httpServer.listen(env.PORT, () => {
    console.log(`\n🍕 PizzaHub Server`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🚀 Running on   : http://localhost:${env.PORT}`);
    console.log(`🌍 Environment  : ${env.NODE_ENV}`);
    console.log(`⚡ Socket.IO    : Enabled`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
    httpServer.close(() => {
      console.log('✅ HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('💥 Server startup failed:', err);
  process.exit(1);
});
