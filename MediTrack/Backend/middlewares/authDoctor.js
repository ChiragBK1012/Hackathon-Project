// Backend/middlewares/authDoctor.js
import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.js";

export const protectDoctor = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res
                .status(500)
                .json({ message: "Server misconfigured: JWT_SECRET missing" });
        }

        // From cookie or Authorization header
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

        if (!decoded?.doctorId) {
            return res
                .status(401)
                .json({ message: "Unauthorized - Invalid token" });
        }

        const doctor = await Doctor.findById(decoded.doctorId).select(
            "-password"
        );

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        req.doctor = doctor;
        req.doctorId = doctor._id;

        next();
    } catch (error) {
        console.error("Error in protectDoctor middleware:", error.message);
        return res
            .status(401)
            .json({ message: "Unauthorized - Token failed or expired" });
    }
};
