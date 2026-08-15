import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer;

/**
 * Initializes Socket.IO event handlers.
 * Call this once after creating the Socket.IO server instance.
 */
export const initSocketHandlers = (socketServer: SocketIOServer): void => {
  io = socketServer;

  io.on('connection', (socket: Socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    /**
     * Client joins an order room to receive live status updates.
     * Event: join-order
     * Payload: { orderId: string }
     */
    socket.on('join-order', ({ orderId }: { orderId: string }) => {
      if (typeof orderId === 'string' && orderId.length > 0) {
        socket.join(`order-${orderId}`);
        console.log(`📦 Socket ${socket.id} joined room: order-${orderId}`);
        socket.emit('joined-order', { orderId, message: 'Tracking started' });
      }
    });

    /**
     * Admin clients join the admin room to see all incoming orders.
     * Event: join-admin
     */
    socket.on('join-admin', () => {
      socket.join('admin-room');
      console.log(`🛡️  Admin socket ${socket.id} joined admin-room`);
    });

    /**
     * Client leaves an order room.
     * Event: leave-order
     */
    socket.on('leave-order', ({ orderId }: { orderId: string }) => {
      socket.leave(`order-${orderId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} — ${reason}`);
    });
  });
};

/**
 * Returns the initialized Socket.IO server instance.
 * Throws if called before initialization.
 */
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initSocketHandlers first.');
  }
  return io;
};
