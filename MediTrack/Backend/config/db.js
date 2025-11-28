const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.warn(
            "⚠️  MONGO_URI not set — skipping DB connection (create a .env file with MONGO_URI)"
        );
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ DB Error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
