const express=require('express');
const path=require('path');
const app=express();
const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const connectDB=require('./config/db')
const userRoutes=require('./routes/authRoutes');
const productRoutes=require('./routes/productRoutes');
const orderRoutes=require('./routes/orderRoutes');
const paymentRoutes=require('./routes/paymentRoutes');
const analyticsRoutes=require('./routes/analyticsRoutes');
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/auth',userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/test', express.static(path.join(__dirname, '../frontend')));
const PORT=process.env.PORT||3000;
app.get("/",(req,res)=>{
    res.send('hey buddy');
})
app.listen(PORT,()=>{
    console.log("connected server bn gya h janhvi beta");
});