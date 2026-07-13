const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createRazorpayOrder, verifyPayment } = require('../controller/paymentController');

router.post('/order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
