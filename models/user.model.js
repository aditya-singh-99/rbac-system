import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["ADMIN","BUSINESS","USER"],
        default:"USER"
    },
    userDetails:{
        name:String,
        address:String,
        phone:String
    },
    businessDetails:{
        details:String,
        website:String,
        products:{type:[String],default:[]}
    },
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) 
    return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.compare=async function(password){
    return await bcrypt.compare(password,this.password)
}

const User=mongoose.model('user',userSchema)
export default User