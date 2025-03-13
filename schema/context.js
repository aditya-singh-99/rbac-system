import jwt from "jsonwebtoken";

const jwtSecret=process.env.JWT_SECRET
const context=({req,res})=>{
    try {
        const authorization=req.headers.authorization
        if(!authorization||!authorization.startsWith("Bearer "))
            return {user:null}
        const token=authorization.split(" ")[1]
        if(!token)
        throw new Error("Token not present")
        const decoded=jwt.verify(token,jwtSecret)
        console.log(decoded)
        return {user:decoded}
    } catch (error) {
        console.log(error)
        return {user:null}
    }
}
export default context