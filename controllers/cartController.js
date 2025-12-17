const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId }).populate("products.product");
        if (!cart) return res.status(200).json({ message: "Cart not found", cart: { products: [] } });
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ error: "Failed to get cart", message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            const newCart = await Cart.create({ user: req.user.userId, products: [{ product: productId, quantity }] });
            await newCart.populate("products.product");
            return res.status(200).json({ message: "Cart created", cart: newCart });
        }
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });
        const existingIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (existingIndex > -1) cart.products[existingIndex].quantity += quantity;
        else cart.products.push({ product: productId, quantity });
        await cart.save();
        await cart.populate("products.product");
        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ error: "Failed to add to cart", message: error.message });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1" });
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        const index = cart.products.findIndex(item => item._id.toString() === productId);
        if (index === -1) return res.status(404).json({ error: "Product not found in cart" });
        cart.products[index].quantity = quantity;
        await cart.save();
        await cart.populate("products.product");
        res.status(200).json({ message: "Quantity updated", cart });
    } catch (error) {
        res.status(500).json({ error: "Failed to update quantity", message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        const index = cart.products.findIndex(item => item._id.toString() === productId);
        if (index === -1) return res.status(404).json({ error: "Product not found in cart" });
        cart.products.splice(index, 1);
        await cart.save();
        await cart.populate("products.product");
        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove from cart", message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        cart.products = [];
        await cart.save();
        res.status(200).json({ message: "Cart cleared", cart });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear cart", message: error.message });
    }
};

module.exports = { getCart, addToCart, updateQuantity, removeFromCart, clearCart };