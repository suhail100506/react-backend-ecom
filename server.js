require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const User = require('./models/User');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://react-frontend-ecom-nine.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Admin credentials
const ADMIN_EMAIL = 'admin@ecommerce.com';
const ADMIN_PASSWORD = 'Admin@123';

// Create admin
const createAdminUser = async () => {
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await User.create({
            username: 'admin',
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
        });
        console.log('Admin created');
    }
};

connectDB().then(createAdminUser);

// Routes
app.use('/auth', authRouter);
app.use('/products', authMiddleware, productsRouter);
app.use('/carts', authMiddleware, cartRouter);
app.use('/orders', authMiddleware, ordersRouter);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});