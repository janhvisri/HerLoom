const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { getAnalytics } = require('../controller/analyticsController');

// Admin: get all orders
router.get('/stats', protect, admin, getAnalytics);



module.exports = router;
