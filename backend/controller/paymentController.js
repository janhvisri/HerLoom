const Razorpay = require("razorpay");
const crypto = require("crypto");

const getRazorpayInstance = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error("Missing Razorpay credentials. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.");
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
};

const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "A valid amount is required." });
        }

        const instance = getRazorpayInstance();
        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: receipt || crypto.randomBytes(10).toString("hex"),
        };

        const order = await instance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: "Missing payment verification fields." });
    }

    try {
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            throw new Error("Missing Razorpay secret. Set RAZORPAY_KEY_SECRET in .env.");
        }

        const generatedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature === razorpay_signature) {
            return res.status(200).json({ message: "Payment verified successfully." });
        }

        return res.status(400).json({ message: "Payment verification failed." });
    } catch (error) {
        console.error("Razorpay verification error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment,
};