require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const User = require('./models/User');
const productsRouter = require('./routes/products.js');
const cartRouter = require('./routes/cart.js');
const authRouter = require('./routes/auth.js');
const ordersRouter = require('./routes/orders.js');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin credentials
const ADMIN_EMAIL = 'admin@ecommerce.com';
const ADMIN_PASSWORD = 'Admin@123';

// Create admin user if it doesn't exist
const createAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await User.create({
                username: 'admin',
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin user created');
            console.log('Email:', ADMIN_EMAIL);
            console.log('Password:', ADMIN_PASSWORD);
        }
    } catch (error) {
        console.error('Error creating admin:', error.message);
    }
};

// Initialize database and create admin
connectDB().then(() => {
    createAdminUser();
});

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://react-frontend-ecom-nine.vercel.app"
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json());

app.use('/auth', authRouter);

app.use('/products', authMiddleware, productsRouter);
app.use('/carts', authMiddleware, cartRouter);
app.use('/orders', authMiddleware, ordersRouter);

app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${process.env.PORT}`);
});