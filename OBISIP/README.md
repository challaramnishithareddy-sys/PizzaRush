# 🍕 PizzaHub — Complete Project Documentation

> **Full-Stack Pizza Ordering & Delivery Tracking Web Application**
> Built for Oasis Infobyte Level 3 Internship Submission

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Folder Structure](#folder-structure)
6. [Backend API Endpoints](#backend-api-endpoints)
7. [Database Schema](#database-schema)
8. [Frontend Pages & Components](#frontend-pages--components)
9. [State Management](#state-management)
10. [Authentication Flow](#authentication-flow)
11. [Payment Integration](#payment-integration)
12. [Real-Time Features](#real-time-features)
13. [Deployment to Vercel](#deployment-to-vercel)
14. [MongoDB Atlas Setup](#mongodb-atlas-setup)
15. [Environment Variables](#environment-variables)
16. [Bug Fixes & Debugging](#bug-fixes--debugging)
17. [Live URLs](#live-urls)
18. [Demo Credentials](#demo-credentials)
19. [Menu Data (INR)](#menu-data-inr)
20. [How to Run Locally](#how-to-run-locally)

---

## Project Overview

**PizzaHub** is a production-ready, full-stack pizza ordering web application featuring:
- A beautiful dark-themed customer-facing storefront
- Real-time order tracking with Socket.IO
- Razorpay payment integration (with demo/test mode)
- Admin dashboard with revenue analytics, order management, and pizza CRUD
- MongoDB Atlas cloud database
- Deployed on Vercel (frontend + backend as serverless functions)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Zustand** | Lightweight state management |
| **Axios** | HTTP client |
| **Socket.IO Client** | Real-time WebSocket communication |
| **Recharts** | Charts for admin dashboard |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |
| **Vanilla CSS** | Custom styling (no Tailwind) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express.js** | Web framework |
| **TypeScript** | Type safety |
| **Mongoose** | MongoDB ODM |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Razorpay SDK** | Payment processing |
| **Socket.IO** | Real-time events |
| **Helmet** | Security headers |
| **express-rate-limit** | Rate limiting |
| **Zod** | Environment validation |
| **compression** | Response compression |

### Infrastructure
| Service | Purpose |
|---|---|
| **Vercel** | Hosting (frontend + backend serverless) |
| **MongoDB Atlas** | Cloud database (M0 Free Tier) |
| **GitHub** | Version control |

---

## Architecture

```mermaid
graph TB
    subgraph "Frontend (Vercel)"
        A[React App<br/>Vite + TypeScript] --> B[Zustand Stores]
        A --> C[React Router v6]
        A --> D[Axios API Client]
        A --> E[Socket.IO Client]
    end

    subgraph "Backend (Vercel Serverless)"
        F[Express.js API] --> G[Auth Controller]
        F --> H[Pizza Controller]
        F --> I[Order Controller]
        F --> J[Payment Controller]
        F --> K[Socket.IO Server]
        F --> L[Middleware<br/>JWT Auth / CORS / Rate Limit]
    end

    subgraph "Database (MongoDB Atlas)"
        M[(Users Collection)]
        N[(Pizzas Collection)]
        O[(Orders Collection)]
    end

    D -->|HTTP REST| F
    E -->|WebSocket| K
    G --> M
    H --> N
    I --> O
    J --> O
```

---

## Features

### 🛒 Customer Features
- **Home Page**: Hero section with animated CTA, bestseller showcase, feature grid, promotional banners
- **Menu Page**: Full pizza catalog with search, category filtering (Veg / Non-Veg / Specialty), price sorting, pagination
- **Pizza Customizer**: Dynamic customization — choose size (Small/Medium/Large), crust type (Thin/Thick/Stuffed), extra toppings with live price calculation
- **Shopping Cart**: Add/remove items, quantity adjustment, coupon codes (`PIZZA10`, `SAVE20`, `WELCOME15`), persistent via Zustand + localStorage
- **Checkout**: Delivery address form with validation, saved address selection, Razorpay payment gateway
- **Order Tracking**: Real-time step-by-step timeline (Placed → Confirmed → Preparing → Out for Delivery → Delivered) via Socket.IO
- **Order History**: View all past orders with status badges
- **User Profile**: Edit name, phone, manage saved addresses
- **Authentication**: Register / Login with JWT tokens

### 🛡️ Admin Features
- **Dashboard**: 30-day revenue chart (Recharts), total orders, revenue, active users stats
- **Manage Pizzas**: Full CRUD — create, edit, delete pizzas with image URLs, sizes, toppings
- **Manage Orders**: View all orders, update status (Confirmed → Preparing → Out for Delivery → Delivered), real-time Socket.IO broadcasts

### 🔐 Security
- JWT-based authentication with Bearer tokens
- bcryptjs password hashing (12 salt rounds)
- Helmet security headers
- CORS with dynamic origin validation (localhost + *.vercel.app)
- Rate limiting on auth endpoints (dev mode)
- Zod environment variable validation

---

## Folder Structure

```
pizza/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                     # API client modules
│   │   │   ├── axios.ts             # Axios instance with interceptors
│   │   │   ├── auth.api.ts          # Auth API (login, register, profile)
│   │   │   ├── pizza.api.ts         # Pizza API (list, CRUD)
│   │   │   ├── order.api.ts         # Order API (create, track, history)
│   │   │   └── payment.api.ts       # Payment API (Razorpay)
│   │   ├── components/
│   │   │   ├── common/              # Reusable UI components
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx       # Navigation bar
│   │   │   │   └── Footer.tsx       # Site footer
│   │   │   ├── order/
│   │   │   │   ├── OrderCard.tsx     # Order summary card
│   │   │   │   └── OrderTimeline.tsx # Step-by-step tracker
│   │   │   ├── payment/
│   │   │   │   └── RazorpayButton.tsx# Razorpay checkout button
│   │   │   └── pizza/
│   │   │       ├── CartItem.tsx      # Cart line item
│   │   │       ├── PizzaCard.tsx     # Menu pizza card
│   │   │       └── PizzaCustomizer.tsx# Size/crust/topping selector
│   │   ├── context/
│   │   │   └── SocketContext.tsx     # Socket.IO provider
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Menu.tsx             # Pizza catalog
│   │   │   ├── Cart.tsx             # Shopping cart
│   │   │   ├── Checkout.tsx         # Address + payment
│   │   │   ├── Login.tsx            # Login form
│   │   │   ├── Register.tsx         # Registration form
│   │   │   ├── OrderHistory.tsx     # Past orders list
│   │   │   ├── OrderTracking.tsx    # Live order tracker
│   │   │   ├── Profile.tsx          # User profile editor
│   │   │   └── admin/
│   │   │       ├── Dashboard.tsx    # Admin analytics
│   │   │       ├── ManageOrders.tsx # Order status management
│   │   │       └── ManagePizzas.tsx # Pizza CRUD management
│   │   ├── router/
│   │   │   ├── index.tsx            # Route definitions
│   │   │   └── ProtectedRoute.tsx   # Auth/role guard
│   │   ├── store/
│   │   │   ├── authStore.ts         # Auth state (Zustand)
│   │   │   └── cartStore.ts         # Cart state (Zustand)
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── utils/
│   │   │   ├── constants.ts         # App constants
│   │   │   └── formatters.ts        # Price/date formatters
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles + design system
│   ├── vercel.json                  # Vercel SPA config
│   ├── .env.example                 # Environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                          # Express Backend
│   ├── api/
│   │   └── index.ts                 # Vercel serverless entry point
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # MongoDB connection (cached)
│   │   │   └── env.ts               # Zod env validation
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts   # Register, login, profile
│   │   │   ├── pizza.controller.ts  # Pizza CRUD
│   │   │   ├── order.controller.ts  # Order lifecycle
│   │   │   └── payment.controller.ts# Razorpay integration
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # JWT verification
│   │   │   ├── admin.middleware.ts  # Admin role check
│   │   │   └── error.middleware.ts  # Global error handler
│   │   ├── models/
│   │   │   ├── User.ts             # User schema
│   │   │   ├── Pizza.ts            # Pizza schema
│   │   │   └── Order.ts            # Order schema
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── pizza.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── seed.routes.ts      # Database seed endpoint
│   │   ├── seed/
│   │   │   ├── seed.ts             # CLI seed script
│   │   │   └── seedMenu.ts         # Menu-only seed
│   │   ├── socket/
│   │   │   └── socket.handler.ts   # Socket.IO event handlers
│   │   ├── utils/
│   │   │   ├── ApiResponse.ts      # Standardized response
│   │   │   ├── AppError.ts         # Custom error class
│   │   │   └── asyncHandler.ts     # Async error wrapper
│   │   ├── app.ts                  # Express configuration
│   │   └── server.ts               # HTTP server + Socket.IO
│   ├── vercel.json                  # Vercel serverless config
│   ├── .env / .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## Backend API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `PUT` | `/api/auth/profile` | ✅ | Update profile & addresses |

### Pizzas (`/api/pizzas`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/pizzas` | ❌ | List all pizzas (search, filter, paginate) |
| `GET` | `/api/pizzas/:id` | ❌ | Get pizza details |
| `POST` | `/api/pizzas` | ✅ Admin | Create new pizza |
| `PUT` | `/api/pizzas/:id` | ✅ Admin | Update pizza |
| `DELETE` | `/api/pizzas/:id` | ✅ Admin | Delete pizza |

### Orders (`/api/orders`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/orders` | ✅ | Create new order |
| `GET` | `/api/orders` | ✅ | Get user's orders (admin: all) |
| `GET` | `/api/orders/:id` | ✅ | Get order details |
| `PATCH` | `/api/orders/:id/status` | ✅ Admin | Update order status |

### Payments (`/api/payments`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/payments/create` | ✅ | Create Razorpay order |
| `POST` | `/api/payments/verify` | ✅ | Verify payment signature |

### Utility
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ | Health check |
| `GET` | `/api/setup-seed` | ❌ | Seed database via HTTP |

---

## Database Schema

### Users Collection
```typescript
{
  name: string;
  email: string;          // unique
  password: string;       // bcrypt hashed
  role: 'customer' | 'admin';
  phone?: string;
  addresses: [{
    label: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }];
  createdAt: Date;
  updatedAt: Date;
}
```

### Pizzas Collection
```typescript
{
  name: string;
  description: string;
  category: 'veg' | 'non-veg' | 'specialty';
  basePrice: number;       // INR
  sizes: [{ size: 'small' | 'medium' | 'large', price: number }];
  crusts: string[];        // ['thin', 'thick', 'stuffed']
  toppings: [{ name: string, price: number }];
  image: string;           // Unsplash URL
  isFeatured: boolean;
  isAvailable: boolean;
  rating: number;
  totalRatings: number;
  tags: string[];
}
```

### Orders Collection
```typescript
{
  user: ObjectId;          // ref: User
  items: [{
    pizza: ObjectId;       // ref: Pizza
    size: string;
    crust: string;
    toppings: string[];
    quantity: number;
    price: number;
  }];
  deliveryAddress: { street, city, state, pincode };
  status: 'placed' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  estimatedDelivery?: Date;
  createdAt: Date;
}
```

---

## Frontend Pages & Components

### Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with hero, bestsellers, features, promos |
| Menu | `/menu` | Full pizza catalog with search/filter/sort/pagination |
| Cart | `/cart` | Shopping cart with coupon support |
| Checkout | `/checkout` | Delivery address + Razorpay payment |
| Login | `/login` | User login form |
| Register | `/register` | User registration form |
| Order History | `/orders` | List of past orders |
| Order Tracking | `/orders/:id` | Real-time order status timeline |
| Profile | `/profile` | Edit profile & manage addresses |
| Admin Dashboard | `/admin` | Revenue chart + stats |
| Manage Orders | `/admin/orders` | Update order statuses |
| Manage Pizzas | `/admin/pizzas` | Pizza CRUD |

### Reusable Components

| Component | Description |
|---|---|
| `Button` | Primary/secondary/ghost variants, loading state |
| `Input` | Form input with label, error message |
| `Badge` | Status/category badges with colors |
| `Modal` | Overlay modal with close button |
| `Spinner` | Loading spinner animation |
| `PizzaCard` | Pizza menu card with image, price, add-to-cart |
| `PizzaCustomizer` | Size/crust/topping selector modal |
| `CartItem` | Cart line item with quantity controls |
| `OrderCard` | Order summary card |
| `OrderTimeline` | Step-by-step delivery tracker |
| `RazorpayButton` | Razorpay checkout integration |
| `Header` | Navigation bar with auth state |
| `Footer` | Site footer with links |

---

## State Management

### Auth Store (`authStore.ts` — Zustand)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email, password) => Promise<void>;
  register: (name, email, password) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}
```
- Persists token to `localStorage`
- Auto-loads user on app mount
- Clears on 401 responses via Axios interceptor

### Cart Store (`cartStore.ts` — Zustand)
```typescript
interface CartState {
  items: CartItem[];
  couponCode: string | null;
  addItem: (pizza, size, crust, toppings) => void;
  removeItem: (id) => void;
  updateQuantity: (id, qty) => void;
  applyCoupon: (code) => void;
  clearCart: () => void;
  // Computed
  subtotal: number;
  deliveryFee: number;  // Free above ₹499
  discount: number;
  total: number;
}
```
- Persists cart to `localStorage`
- Supports coupon codes: `PIZZA10` (10% off), `SAVE20` (₹20 off), `WELCOME15` (15% off)

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB

    U->>F: Enter email/password
    F->>B: POST /api/auth/login
    B->>DB: Find user by email
    DB-->>B: User document
    B->>B: Compare bcrypt hash
    B->>B: Sign JWT (id, role, email)
    B-->>F: { token, user }
    F->>F: Store token in localStorage
    F->>F: Update Zustand authStore
    F-->>U: Redirect to home

    Note over F,B: Subsequent requests
    F->>B: GET /api/orders (Authorization: Bearer <token>)
    B->>B: Verify JWT
    B->>DB: Query orders
    DB-->>B: Orders
    B-->>F: { orders }
```

---

## Payment Integration

### Razorpay Flow
```mermaid
sequenceDiagram
    participant C as Customer
    participant F as Frontend
    participant B as Backend
    participant R as Razorpay

    C->>F: Click "Pay Now"
    F->>B: POST /api/payments/create { orderId, amount }
    B->>R: Create Razorpay Order
    R-->>B: { razorpay_order_id }
    B-->>F: { orderId, amount, key }

    F->>R: Open Razorpay Checkout Modal
    C->>R: Enter card details & pay
    R-->>F: { payment_id, signature }

    F->>B: POST /api/payments/verify { payment_id, signature }
    B->>B: Verify HMAC signature
    B->>B: Update order.paymentStatus = 'paid'
    B-->>F: { success: true }
    F-->>C: 🎉 Order placed!
```

> **Demo Mode**: If Razorpay keys are not configured, payments are simulated automatically. Test card: `4111 1111 1111 1111`, CVV: `123`, Expiry: any future date, OTP: `1234`.

---

## Real-Time Features

### Socket.IO Events

| Event | Direction | Description |
|---|---|---|
| `order:statusUpdate` | Server → Client | Order status changed (broadcasts to order owner) |
| `order:new` | Server → Admin | New order placed (admin notification) |
| `join:order` | Client → Server | Join room for specific order tracking |

### How It Works on Vercel
- Vercel serverless functions don't support persistent WebSocket connections
- Socket.IO is configured with **HTTP long-polling first** (`transports: ['polling', 'websocket']`)
- Real-time updates work via polling fallback with ~1-2s latency

---

## Deployment to Vercel

### Steps Performed

#### 1. Backend Preparation
- Created `server/api/index.ts` — Vercel serverless entry point wrapping Express app
- Called `connectDatabase()` before each request (with connection caching)
- Updated `server/vercel.json` with `builds` and `routes` config
- Updated CORS to dynamically allow `*.vercel.app` domains
- Disabled rate limiting in production (Vercel IP resolution issues)
- Set `bufferCommands: false` in Mongoose for serverless compatibility
- Added default env fallbacks in Zod schema

#### 2. Frontend Preparation
- Updated `client/src/api/axios.ts` to use `VITE_API_URL` env var
- Updated `client/src/context/SocketContext.tsx` to use `VITE_WS_URL` env var
- Created `client/vercel.json` with SPA rewrite rules
- Created `client/.env.example` template

#### 3. Deployment Commands
```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy Backend
cd server
vercel --yes --name pizzahub-api
vercel --prod --yes

# Deploy Frontend
cd ../client
vercel --yes --name pizzahub
vercel --prod --yes
```

#### 4. Environment Variables (Set via CLI)
```powershell
# Backend env vars
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add NODE_ENV production
vercel env add CLIENT_URL production

# Frontend env vars
vercel env add VITE_API_URL production
vercel env add VITE_WS_URL production
```

---

## MongoDB Atlas Setup

### Steps
1. Created free M0 cluster on [cloud.mongodb.com](https://cloud.mongodb.com)
2. Created database user: `pk3571830_db_user` with password `Prasanth_123`
3. Network Access: Added `0.0.0.0/0` (allow all IPs for Vercel)
4. Connection string:
   ```
   mongodb+srv://pk3571830_db_user:Prasanth_123@cluster0.4ggwaat.mongodb.net/pizzahub
   ```

### Data Seeded
- **8 pizza menu items** across 3 categories (Veg, Non-Veg, Specialty) with INR prices
- **Admin user**: `admin@pizzahub.com` / `admin123`
- **Customer user**: `customer@pizzahub.com` / `customer123`

---

## Environment Variables

### Backend (`server/.env`)
| Variable | Value | Required |
|---|---|---|
| `PORT` | `5000` | ✅ |
| `NODE_ENV` | `production` | ✅ |
| `MONGODB_URI` | `mongodb+srv://pk3571830_db_user:Prasanth_123@cluster0.4ggwaat.mongodb.net/pizzahub` | ✅ |
| `JWT_SECRET` | `PizzaHub_JWT_Secret_2024_Secure_Key_Min32Chars!` | ✅ |
| `JWT_EXPIRES_IN` | `7d` | ✅ |
| `CLIENT_URL` | `https://pizzahub-delta-wheat.vercel.app` | ✅ |
| `RAZORPAY_KEY_ID` | *(optional — demo mode if unset)* | ⚠️ |
| `RAZORPAY_KEY_SECRET` | *(optional)* | ⚠️ |

### Frontend (Vercel Dashboard)
| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://pizzahub-api.vercel.app/api` |
| `VITE_WS_URL` | `https://pizzahub-api.vercel.app` |

---

## Bug Fixes & Debugging

### Issues Encountered & Resolved

| # | Issue | Root Cause | Fix |
|---|---|---|---|
| 1 | `tsc` build failures with `@types/three` and `@types/webxr` | Parent `node_modules` leaking types | Changed client build script to `vite build` (esbuild-based) |
| 2 | JWT `SignOptions` type error | Incorrect type import | Fixed to use `jwt.SignOptions` |
| 3 | Payment controller `void` return mismatch | Async handler expected `void` return | Removed `return` from `res.json()` calls |
| 4 | Error middleware `string/number` comparison | MongoDB error code `11000` compared as string | Added dual comparison: `=== '11000' \|\| === 11000` |
| 5 | `toJSON` delete operator type error | TypeScript strictness on `delete this.password` | Added type cast `(this as any)` |
| 6 | MongoDB Atlas `querySrv ECONNREFUSED` locally | Local DNS blocking SRV lookups | Used `dns.setServers(['8.8.8.8'])` for seeding scripts |
| 7 | MongoDB `bad auth: Authentication failed` | Wrong username (`user` instead of `pk3571830_db_user`) | Corrected username and updated password to `Prasanth_123` |
| 8 | Vercel `FUNCTION_INVOCATION_FAILED` on API routes | `connectDatabase()` not called in serverless handler | Added `await connectDatabase()` in `api/index.ts` |
| 9 | Mongoose `buffering timed out after 10000ms` | Serverless cold start + buffering | Added `bufferCommands: false` + connection caching |
| 10 | Checkout page crash: `Cannot read properties of undefined (reading 'find')` | `user.addresses` was `undefined` for new users | Changed to `user?.addresses?.find(...)` with optional chaining |
| 11 | Vercel `No Output Directory named "public"` | Switched from `builds` to `rewrites` format incorrectly | Reverted to `builds` with `@vercel/node` |
| 12 | `MONGODB_URI already exists` on Vercel | Env var existed from previous deployment | Used `vercel env rm` then `vercel env add` |

---

## Live URLs

| Service | URL | Status |
|---|---|---|
| 🌐 **Frontend** | [https://pizzahub-delta-wheat.vercel.app](https://pizzahub-delta-wheat.vercel.app) | 🟢 Live |
| ⚙️ **Backend API** | [https://pizzahub-api.vercel.app](https://pizzahub-api.vercel.app) | 🟢 Live |
| 🍕 **Pizza Builder** | [https://pizzahub-delta-wheat.vercel.app/build](https://pizzahub-delta-wheat.vercel.app/build) | 🟢 Live |
| 🔍 **Health Check** | [https://pizzahub-api.vercel.app/health](https://pizzahub-api.vercel.app/health) | 🟢 `200 OK` |
| 🍕 **Pizza API** | [https://pizzahub-api.vercel.app/api/pizzas](https://pizzahub-api.vercel.app/api/pizzas) | 🟢 `200 OK` (8 items) |

---

## Menu Data (INR)

### 🌿 Vegetarian
| Pizza | Small | Medium | Large | Rating |
|---|---|---|---|---|
| Margherita Classic | ₹199 | ₹349 | ₹499 | ⭐ 4.8 (340) |
| Paneer Tikka Supreme | ₹279 | ₹449 | ₹629 | ⭐ 4.9 (420) |
| Veggie Paradise | ₹249 | ₹399 | ₹569 | ⭐ 4.6 (180) |

### 🍖 Non-Vegetarian
| Pizza | Small | Medium | Large | Rating |
|---|---|---|---|---|
| Chicken Pepperoni Passion | ₹329 | ₹529 | ₹749 | ⭐ 4.9 (510) |
| Fiery Chicken Tikka | ₹299 | ₹489 | ₹689 | ⭐ 4.7 (290) |
| BBQ Smoked Chicken | ₹319 | ₹509 | ₹719 | ⭐ 4.8 (310) |

### ⭐ Specialty
| Pizza | Small | Medium | Large | Rating |
|---|---|---|---|---|
| Chef's Truffle Mushroom Fusion | ₹359 | ₹579 | ₹799 | ⭐ 5.0 (150) |
| Four Cheese Blast (Quattro Formaggi) | ₹339 | ₹549 | ₹769 | ⭐ 4.8 (230) |

### Available Toppings (Extra)
| Topping | Price |
|---|---|
| Extra Cheese | ₹50 |
| Extra Paneer | ₹60 |
| Extra Chicken | ₹65 |
| Extra Pepperoni | ₹70 |
| Truffle Oil Extra | ₹80 |
| Parmesan Shavings | ₹60 |
| Jalapenos | ₹35 |
| Black Olives | ₹35 |
| Sweet Corn | ₹30 |
| Mushrooms | ₹40 |
| BBQ Dip | ₹30 |
| Chilli Flakes / Oregano | ₹15 |

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (or local MongoDB)

### Backend
```bash
cd pizza/server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd pizza/client
npm install
npm run dev
# App runs on http://localhost:5173
# Vite proxies /api to localhost:5000
```

### Seed Database
```bash
cd pizza/server
npx ts-node src/seed/seed.ts
```

---

## Git History

```bash
git init
git add -A
git commit -m "feat: initial PizzaHub full-stack implementation"
# 84 files, 12,673 insertions
```

---

> **Built with ❤️ by Prashanth Kumar**
> Oasis Infobyte Level 3 Internship Project
