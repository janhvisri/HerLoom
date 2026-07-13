const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("Database cleared successfully. All users, products, and orders have been removed.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();
