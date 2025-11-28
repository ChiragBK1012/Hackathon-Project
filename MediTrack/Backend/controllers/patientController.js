// Backend/controllers/patientController.js
import Patient from "../models/patient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = patientId => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env");
    }

    return jwt.sign({ patientId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= REGISTER PATIENT =================
export const registerPatient = async (req, res) => {
    try {
        const { name, email, password, age, gender } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required" });
        }

        const exist = await Patient.findOne({ email });
        if (exist)
            return res.status(409).json({ message: "Patient already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const patient = await Patient.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
        });

        const token = generateToken(patient._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.status(201).json({ message: "Patient registered", patient });
    } catch (error) {
        console.error("Register patient error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= LOGIN PATIENT =================
export const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        const patient = await Patient.findOne({ email });
        if (!patient)
            return res.status(404).json({ message: "Patient not found" });

        const match = await bcrypt.compare(password, patient.password);
        if (!match)
            return res.status(400).json({ message: "Invalid password" });

        const token = generateToken(patient._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.status(200).json({ message: "Login successful", patient });
    } catch (error) {
        console.error("Login patient error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET PROFILE =================
export const getPatientProfile = async (req, res) => {
    try {
        res.json(req.patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= UPDATE PROFILE =================
export const updatePatientProfile = async (req, res) => {
    try {
        const updates = req.body;

        const patient = await Patient.findByIdAndUpdate(
            req.patientId,
            updates,
            {
                new: true,
            }
        ).select("-password");

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json({ message: "Patient profile updated", patient });
    } catch (error) {
        console.error("Update patient profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
