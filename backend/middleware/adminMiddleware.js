const User=require('../model/User');
const admin=async(req,res,next)=>{
    if(req.user && req.user.role=='admin'){
        next();
    }
    else{
        res.status(403).json({message:"access denied admin only"});
    }
};
module.exports=admin;