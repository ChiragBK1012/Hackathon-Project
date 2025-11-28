import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import doctorRoutes from "./routes/doctorRoute.js";
import patientRoutes from "./routes/patientRoute.js";
import prescriptionRoutes from "./routes/prescriptionRoute.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Connect MongoDB
connectDB();

// API Routes
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/prescription", prescriptionRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Doctor-Patient-Prescription API Running...");
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
