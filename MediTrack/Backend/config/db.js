// Backend/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI missing in .env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ DB Connection Failed:", err.message);
        process.exit(1);
    }
};

export default connectDB;
