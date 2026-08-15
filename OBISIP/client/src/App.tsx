import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';
import { router } from './router';

/**
 * App root — wraps the router with Socket.IO context and the toast container.
 */
const App: React.FC = () => {
  return (
    <SocketProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: '10px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          },
        }}
      />
    </SocketProvider>
  );
};

export default App;
