import jwt from "jsonwebtoken";
import Patient from "../models/patient.js";

export const protectPatient = async (req, res, next) => {
  try {
    // Read JWT from cookies
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.patientId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Fetch patient
    const patient = await Patient.findById(decoded.patientId).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Attach to request
    req.patient = patient;       
    req.patientId = decoded.patientId;

    next();
  } catch (error) {
    console.error("Error in protectedPatientRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Token failed or expired" });
  }
};
