// Backend/controllers/doctorController.js
import Doctor from "../models/doctor.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT Token
const generateToken = doctorId => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env");
    }

    return jwt.sign({ doctorId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// Remove sensitive fields before returning doctor
const sanitizeDoctor = doctor => {
    if (!doctor) return doctor;
    const docObj = doctor.toObject ? doctor.toObject() : { ...doctor };
    delete docObj.password;
    return docObj;
};

// ================= REGISTER DOCTOR =================
export const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required" });
        }

        const exist = await Doctor.findOne({ email });
        if (exist)
            return res.status(409).json({ message: "Doctor already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const doctor = await Doctor.create({
            name,
            email,
            password: hashedPassword,
            specialization,
        });

        const token = generateToken(doctor._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.status(201).json({
            message: "Doctor registered successfully",
            doctor: sanitizeDoctor(doctor),
        });
    } catch (error) {
        console.error("Register doctor error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= LOGIN DOCTOR =================
export const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const doctor = await Doctor.findOne({ email });
        if (!doctor)
            return res.status(404).json({ message: "Doctor not found" });

        const match = await bcrypt.compare(password, doctor.password);
        if (!match)
            return res.status(400).json({ message: "Invalid password" });

        const token = generateToken(doctor._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.status(200).json({
            message: "Login successful",
            doctor: sanitizeDoctor(doctor),
        });
    } catch (error) {
        console.error("Login doctor error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET PROFILE =================
export const getDoctorProfile = async (req, res) => {
    try {
        res.json(req.doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= UPDATE PROFILE =================
export const updateDoctorProfile = async (req, res) => {
    try {
        const updates = req.body;

        const doctor = await Doctor.findByIdAndUpdate(req.doctorId, updates, {
            new: true,
        }).select("-password");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.json({ message: "Doctor profile updated", doctor });
    } catch (error) {
        console.error("Update doctor profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
