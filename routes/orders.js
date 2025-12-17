const express = require('express');
const router = express.Router();
const { 
    getOrders, 
    createOrder, 
    getOrderById,
    updateOrderStatus,
    cancelOrder 
} = require('../controllers/orderController');

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
