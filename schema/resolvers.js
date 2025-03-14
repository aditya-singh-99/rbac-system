import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const jwtSecret=process.env.JWT_SECRET
const resolvers={
    Query:{
        users:async(parent,args,context)=>{
            try {
                //console.log(context.user)
                if(!context.user)
                    throw new Error("Unauthorized")
                if(context.user.role!=="ADMIN")
                    throw new Error("Access Denied")
                return await User.find()
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
        me:async(parent,args,context)=>{
            try {
                if(!context.user)
                    throw new Error("Unauthorized")
                const user=await User.findById(context.user.id)
                if(!user)
                    throw new Error("User not found")
                if(user.role==="USER")
                    user.businessDetails=null
                return user
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
        myBusiness:async(parent,args,context)=>{
            try {
                if(!context.user)
                    throw new Error("Unauthorized")
                const user=await User.findById(context.user.id)
                if(!user)
                    throw new Error("User not found")
                if(user.role==="USER")
                    throw new Error("You are a user, not business")
                return user.businessDetails
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
        anyUser:async(parent,args,context)=>{
            try {
                if(!context.user)
                    throw new Error("Unauthorized")
                if(context.user.role!=="ADMIN")
                    throw new Error("Access Denied")
                const {id}=args
                const user=await User.findById(id)
                if(!user)
                    throw new Error("User not found")
                return user
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
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
        setRole:async(parent,args,context)=>{
            try {
                if(!context.user)
                    throw new Error("Unauthorized")
                if(context.user.role!=="ADMIN")
                    throw new Error("Access Denied")
                const {id,role}=args
                const user=await User.findById(id)
                if(!user)
                    throw new Error("User not found")
                user.role=role
                await user.save()
                return user
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
        editMyDetails:async(parent,args,context)=>{
            try {
                if(!context.user)
                    throw new Error("Unauthorized")
                const user=await User.findById(context.user.id)
                if(!user)
                    throw new Error("User not found")
                const {userDetails}=args
                user.userDetails={...user.userDetails,...userDetails}
                await user.save()
                return user
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
        editMyBusiness:async(parent,args,context)=>{
            try {
                if(!context.user)
                    throw new Error("Unauthorized")
                console.log(context.user)
                if(context.user.role==="USER")
                    throw new Error("You are a user, not business")
                const user=await User.findById(context.user.id)
                if(!user)
                    throw new Error("User not found")
                const {businessDetails}=args
                user.businessDetails={...user.businessDetails,...businessDetails}
                await user.save()
                return user.businessDetails
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
        editAnyUser:async(parent,args,context)=>{
            try {
                if(!context.user)
                    throw new Error("Unauthorized")
                if(context.user.role!=="ADMIN")
                    throw new Error("Access Denied")
                const {id}=args
                const user=await User.findById(id)
                if(!user)
                    throw new Error("User not found")
                const {userDetails,businessDetails}=args
                if(userDetails)
                user.userDetails={...user.userDetails,...userDetails}
                if(businessDetails)
                user.businessDetails={...user.businessDetails,...businessDetails}
                await user.save()
                return user
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        },
        deleteAnyUser:async(parent,args,context)=>{
            try {
                if(!context.user)
                    throw new Error("Unauthorized")
                if(context.user.role!=="ADMIN")
                    throw new Error("Access Denied")
                const {id}=args
                const user=await User.findById(id)
                if(!user)
                    throw new Error("User not found")
                await User.deleteOne({_id:id})
                return user
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        }
    }
}

export default resolvers