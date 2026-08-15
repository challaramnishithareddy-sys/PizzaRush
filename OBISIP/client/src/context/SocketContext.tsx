import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import type { OrderStatusUpdate } from '../types';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinOrderRoom: (orderId: string) => void;
  leaveOrderRoom: (orderId: string) => void;
  joinAdminRoom: () => void;
  onOrderStatusUpdate: (handler: (update: OrderStatusUpdate) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

/**
 * Provides a Socket.IO connection to the entire app.
 * Connects when the user is authenticated, disconnects on logout.
 */
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      return;
    }

    // Create socket connection
    const socket = io((import.meta as any).env.VITE_WS_URL || '/', {
      transports: ['polling', 'websocket'], // polling first for Vercel serverless compatibility
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('⚡ Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  const joinOrderRoom = (orderId: string) => {
    socketRef.current?.emit('join-order', { orderId });
  };

  const leaveOrderRoom = (orderId: string) => {
    socketRef.current?.emit('leave-order', { orderId });
  };

  const joinAdminRoom = () => {
    socketRef.current?.emit('join-admin');
  };

  const onOrderStatusUpdate = (handler: (update: OrderStatusUpdate) => void) => {
    const socket = socketRef.current;
    socket?.on('order-status-update', handler);
    // Return cleanup function
    return () => { socket?.off('order-status-update', handler); };
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        joinOrderRoom,
        leaveOrderRoom,
        joinAdminRoom,
        onOrderStatusUpdate,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

/** Hook to consume the socket context */
export const useSocketContext = (): SocketContextValue => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used within SocketProvider');
  return ctx;
};
