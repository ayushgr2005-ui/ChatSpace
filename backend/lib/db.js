import mongoose from 'mongoose';

export const connectDB = async ()=>{
    try {
        mongoose.connection.on("connected",()=>{
            console.log("Connected to MongoDB");
        });
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB chat-app");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}