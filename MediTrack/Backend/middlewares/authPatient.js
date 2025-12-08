// Backend/middlewares/authPatient.js
import jwt from "jsonwebtoken";
import Patient from "../models/patient.js";

export const protectPatient = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res
                .status(500)
                .json({ message: "Server misconfigured: JWT_SECRET missing" });
        }

        let token = req.cookies?.token;

        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.patientId) {
            return res
                .status(401)
                .json({ message: "Unauthorized - Invalid token" });
        }

        const patient = await Patient.findById(decoded.patientId).select(
            "-password"
        );

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        req.patient = patient;
        req.patientId = patient._id;

        next();
    } catch (error) {
        console.error("Error in protectPatient middleware:", error.message);
        return res
            .status(401)
            .json({ message: "Unauthorized - Token failed or expired" });
    }
};
