import mongoose from "mongoose"

const dbConnect = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected")
    } catch (error) {
        console.error(error)
    }
}

export default dbConnect