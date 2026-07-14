const User=require('../model/User');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const sendEmail=require('../utils/sendEmail');
const Product = require('../model/Product');

const generateToken=(id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn:'30d'}
    );
}


const registerUser=async(req,res)=>{

    const {name,email,password,role}=req.body;

    try {

        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"email already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password,10);


        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role
        });


        if(user){

            const otp=Math.floor(
                10000+Math.random()*90000
            ).toString();


            const message=`your otp for HerLoom registration is ${otp}`;


            await sendEmail(
                email,
                "Welcome to HerLoom",
                message
            );


            return res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                otp,
                token:generateToken(user._id),
                role:user.role
            });

        }
        else{
            return res.status(400).json({
                message:"invalid user data"
            });
        }


    } catch(error){

        res.status(500).json({
            message:"internal server error",
            error:error.message
        });
    }
}
//login user
const loginUser=async(req,res)=>
{
    try{
    const {email,password}=req.body;
     const user=await User.findOne({email});
     if(user && (await bcrypt.compare(password,user.password))){
        res.json({
            _id: user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id),
            role:user.role
        })
     }
     else
    {
            res.status(400).json({message:"invalid email or password"});
     }}catch(err)
     {
           res.status(500).json({message:"internal server error", error: err});

     }
};
const getUsers=async(req,res)=>{
    try{
         const users=await User.find({}).select('-password');
         res.json(users);
    }
    catch(err){
            res.status(500).json({message:"internal server error"});
    }
}

module.exports={
    registerUser,
    loginUser,
    getUsers
};