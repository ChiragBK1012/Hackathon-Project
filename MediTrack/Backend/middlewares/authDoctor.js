import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.js";

export const protectDoctor = async (req, res, next) => {
  try {
    // Read JWT from cookies
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.doctorId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Fetch doctor (optional but recommended)
    const doctor = await Doctor.findById(decoded.doctorId).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Attach to request object
    req.doctor = doctor;   
    req.doctorId = decoded.doctorId;

    next();
  } catch (error) {
    console.error("Error in protectedDoctorRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Token failed or expired" });
  }
};
