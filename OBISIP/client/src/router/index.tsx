import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProtectedRoute } from './ProtectedRoute';
import { Spinner } from '../components/common/Spinner';

// Lazy-load pages for code-splitting (faster initial load)
const Home          = lazy(() => import('../pages/Home'));
const Menu          = lazy(() => import('../pages/Menu'));
const Cart          = lazy(() => import('../pages/Cart'));
const Checkout      = lazy(() => import('../pages/Checkout'));
const OrderTracking = lazy(() => import('../pages/OrderTracking'));
const OrderHistory  = lazy(() => import('../pages/OrderHistory'));
const Profile       = lazy(() => import('../pages/Profile'));
const PizzaBuilder  = lazy(() => import('../pages/PizzaBuilder'));
const Login         = lazy(() => import('../pages/Login'));
const Register      = lazy(() => import('../pages/Register'));
const Dashboard     = lazy(() => import('../pages/admin/Dashboard'));
const ManagePizzas  = lazy(() => import('../pages/admin/ManagePizzas'));
const ManageOrders  = lazy(() => import('../pages/admin/ManageOrders'));

/** Root layout — wraps all pages with Header + Footer */
const RootLayout: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <Suspense fallback={<Spinner fullScreen label="Loading…" />}>
      <Outlet />
    </Suspense>
    <Footer />
  </div>
);

/** 404 Not Found page */
const NotFound: React.FC = () => (
  <div className="page-loader">
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '5rem' }}>🍕</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>404</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>Oops! This page is as missing as your pizza slice.</p>
      <a href="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>← Go back home</a>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: 'menu', element: <Menu /> },
      { path: 'build', element: <PizzaBuilder /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      // Protected customer routes
      { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: 'checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: 'orders', element: <ProtectedRoute><OrderHistory /></ProtectedRoute> },
      { path: 'orders/:id', element: <ProtectedRoute><OrderTracking /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },

      // Admin-only routes
      { path: 'admin', element: <ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute> },
      { path: 'admin/pizzas', element: <ProtectedRoute requireAdmin><ManagePizzas /></ProtectedRoute> },
      { path: 'admin/orders', element: <ProtectedRoute requireAdmin><ManageOrders /></ProtectedRoute> },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);
