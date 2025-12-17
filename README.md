# E-Commerce Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example` and fill in your MongoDB URI and JWT secret

3. Run the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## Default Admin Credentials
- Email: `admin@ecommerce.com`
- Password: `Admin@123`

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user

### Products (Protected)
- GET `/products` - Get all products
- POST `/products` - Add product (Admin only)
- PUT `/products/:id` - Update product (Admin only)
- DELETE `/products/:id` - Delete product (Admin only)

### Cart (Protected)
- GET `/carts` - Get user cart
- POST `/carts` - Add item to cart
- PUT `/carts/:productId` - Update item quantity
- DELETE `/carts/:productId` - Remove item from cart

### Orders (Protected)
- GET `/orders` - Get user orders
- POST `/orders` - Create order from cart
- GET `/orders/:id` - Get order by ID
- PUT `/orders/:id/status` - Update order status (Admin)
- PUT `/orders/:id/cancel` - Cancel order

## Server runs on
`http://localhost:3000`
