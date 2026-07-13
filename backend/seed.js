const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const seedData = async () => {
  try {
    // Delete old data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // Hash password
    const hashedPassword = await bcrypt.hash("12345678", 10);

    // Users
    const users = await User.insertMany([
      {
        name: "Janhvi",
        email: "janhvi@gmail.com",
        password: hashedPassword,
        role: "user",
      },
      {
        name: "Rahul",
        email: "rahul@gmail.com",
        password: hashedPassword,
        role: "user",
      },
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      },
    ]);

    // Products
    const products = await Product.insertMany([
      {
        name: "Bodycon Dress",
        description: "Stylish bodycon dress",
        price: 1900,
        category: "Women",
        stock: 50,
        imageUrl: "",
      },
      {
        name: "Blue Jeans",
        description: "Comfortable jeans",
        price: 899,
        category: "Women",
        stock: 100,
        imageUrl: "",
      },
      {
        name: "Saree",
        description: "Traditional saree",
        price: 4500,
        category: "Ethnic",
        stock: 30,
        imageUrl: "",
      },
    ]);

    // Orders
    await Order.insertMany([
      {
        user: users[0]._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 2,
            imageUrl: "",
          },
          {
            product: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            imageUrl: "",
          },
        ],
        totalAmount: 4699,
        paymentId: "pay_dummy001",
        address: {
          street: "123 MG Road",
          city: "Ghaziabad",
          state: "Uttar Pradesh",
          postalCode: "201009",
          country: "India",
        },
        status: "paid",
      },
      {
        user: users[1]._id,
        items: [
          {
            product: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 1,
            imageUrl: "",
          },
        ],
        totalAmount: 4500,
        paymentId: "pay_dummy002",
        address: {
          street: "45 Civil Lines",
          city: "Lucknow",
          state: "Uttar Pradesh",
          postalCode: "226001",
          country: "India",
        },
        status: "delivered",
      },
    ]);

    console.log("Dummy data inserted successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();