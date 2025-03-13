import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const jwtSecret=process.env.JWT_SECRET
const resolvers={
    Query:{
        users:async(parent,args,context)=>{
            try {
                if(!context.user)
                    throw new Error("Unauthorized")
                console.log(context.user.role)
                if(context.user.role!="ADMIN")
                    throw new Error("Access Denied")
                return await User.find()
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        }
    },
    Mutation:{
        signup:async(parent,args,context)=>{
            try {
                const {email,password}=args
                const oldUser=await User.findOne({email})
                if(oldUser)
                    throw new Error("Email already exists")
                const user=new User({email,password})
                await user.save()
                const token=jwt.sign({id:user._id,role:user.role},jwtSecret,{expiresIn:"1h"})
                return {token,user};
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
        login:async(parent,args,context)=>{
            try {
                const {email,password}=args
                const user=await User.findOne({email})
                if(!user)
                    throw new Error("User do not exists")
                const isValid=await user.compare(password)
                if(!isValid)
                    throw new Error("Invalid Password")
                const token=jwt.sign({id:user._id,role:user.role},jwtSecret,{expiresIn:"1h"})
                return {token,user}
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
        
    }
}

export default resolvers