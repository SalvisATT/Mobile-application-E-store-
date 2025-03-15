import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
    }catch (error) {
        process.exit(1)
    }
}