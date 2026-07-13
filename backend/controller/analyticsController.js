const User = require("../model/User");
const Product = require("../model/Product");
const Order = require("../model/Order");

const getAnalytics = async (req, res) => {
  try {
    // Count totals
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      }
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message
    });
  }
};

module.exports = {
  getAnalytics
};