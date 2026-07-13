const Order = require("../model/Order");
const sendEmail = require("../utils/sendEmail");

// Create new order (simple)
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;
 console.log(req.body);
console.log(req.body.items);
console.log(Array.isArray(req.body.items));
console.log(req.body.items.length);
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user ? req.user._id : undefined,
            items,
            totalAmount,
            address,
            paymentId,
        });

        const savedOrder = await order.save();

        // send confirmation email if available (best-effort)
        try {
            const userEmail = req.user && req.user.email ? req.user.email : null;
            const userName = req.user && req.user.name ? req.user.name : 'Customer';
            if (userEmail) {
                const message = `Dear ${userName},\n\nThank you for your order (${savedOrder._id}). We received your order and will process it shortly.\n\nRegards,\nShop`;
                await sendEmail(userEmail, 'Order received', message);
            }
        } catch (e) {
            console.error('order confirmation email failed:', e.message);
        }

        return res.status(201).json({ message: 'order created successfully', order: savedOrder });
    } catch (error) {
        console.error('createOrder error:', error);
        return res.status(500).json({ message: 'server error', error: error.message });
    }
};


// Get orders for the logged-in user
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        return res.json(orders);
    } catch (error) {
        console.error('getMyOrders error:', error);
        return res.status(500).json({ message: 'server error', error: error.message });
    }
};

// Admin: get all orders and populate user name and role
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name role email')
            .sort({ createdAt: -1 });
        return res.json(orders);
    } catch (error) {
        console.error('getAllOrders error:', error);
        return res.status(500).json({ message: 'server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders
};

// Admin: update order status
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const allowed = ['pending','paid','shipped','delivered','cancelled'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        const updated = await order.save();
        return res.json({ message: 'Order status updated', order: updated });
    } catch (error) {
        console.error('updateOrderStatus error:', error);
        return res.status(500).json({ message: 'server error', error: error.message });
    }
};

module.exports.updateOrderStatus = updateOrderStatus;