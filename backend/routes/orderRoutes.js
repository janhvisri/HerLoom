const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controller/orderController');

// Create a new order (protected)
router.post('/', protect, createOrder);

// Get orders for current user
router.get('/my', protect, getMyOrders);

// Admin: get all orders
router.get('/', protect, admin, getAllOrders);

// Admin: update order status
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
