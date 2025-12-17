const express = require('express');
const router = express.Router();
const { 
    getCart, 
    addToCart, 
    updateQuantity, 
    removeFromCart,
    clearCart 
} = require('../controllers/cartController');

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateQuantity);
router.delete('/:productId', removeFromCart);

module.exports = router;