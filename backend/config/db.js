const mongoose=require('mongoose');
const connectDB=async()=>{
    try
    {
       const conn= await mongoose.connect(process.env.MONGODB_URI);
          console.log("mongodb connected successfully");
    }
     catch (error) {
        console.log('mongodb connected failed',error);
        process.exit(1);
    }
}
module.exports=connectDB; 
