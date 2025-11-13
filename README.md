# E-Commerce MERN Stack Application

A modern, full-featured e-commerce application built with MongoDB, Express, React, and Node.js. Designed with Amazon/Flipkart-style UI and comprehensive functionality.

## ✨ Features

### Core Features
- ✅ User Authentication (Register/Login with JWT)
- ✅ Product Catalog with Advanced Search
- ✅ Shopping Cart with Quantity Management
- ✅ Order Management System
- ✅ Product Reviews & Ratings
- ✅ Wishlist Functionality
- ✅ Advanced Filtering & Sorting
- ✅ Pagination
- ✅ Related Products
- ✅ Product Variants (Color, Size)
- ✅ Discount & Sale Management

### UI/UX Features
- ✅ Amazon/Flipkart-style Modern Design
- ✅ Responsive Mobile Design
- ✅ Toast Notifications
- ✅ Loading States
- ✅ Image Gallery
- ✅ Product Cards with Hover Effects
- ✅ Footer Component
- ✅ Breadcrumb Navigation

## Tech Stack

### Frontend
- **React 18** - UI Library
- **React Router** - Routing
- **Axios** - HTTP Client
- **React Icons** - Icon Library
- **React Toastify** - Toast Notifications
- **CSS3** - Styling (Amazon/Flipkart inspired)

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File Uploads (ready to use)

## Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

3. Start the development servers:
```bash
npm run dev:all
```

This will start both the backend server (port 5000) and React frontend (port 3000).

## Project Structure

```
ecom/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with filters, sorting, pagination)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get single product
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (Authenticated)
- `PUT /api/reviews/:id/helpful` - Mark review as helpful
- `DELETE /api/reviews/:id` - Delete review

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add product to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

## 📋 Next Steps

See **[IMMEDIATE_NEXT_STEPS.md](./IMMEDIATE_NEXT_STEPS.md)** for detailed next steps including:
- Admin Dashboard
- Image Upload
- Payment Integration
- User Profile
- Email Notifications
- And more...

