import mongoose from "mongoose";
export const connectdb=async()=>{
    await mongoose.connect(process.env.MONGODB_URL)
}