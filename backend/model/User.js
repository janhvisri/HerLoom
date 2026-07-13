const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        required:true
    },
    email:{
        type:String,
        unique:true

    },
    verified:{
        type:Boolean,
        default:false
    }
});
module.exports=mongoose.model("User",userSchema);