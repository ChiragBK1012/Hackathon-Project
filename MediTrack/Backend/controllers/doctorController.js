import Doctor from "../models/doctor.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT Token
const generateToken = (doctorId) => {
  return jwt.sign({ doctorId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= REGISTER DOCTOR =================
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    const exist = await Doctor.findOne({ email });
    if (exist) return res.status(409).json({ message: "Doctor already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
    });

    res.cookie("doctorToken", generateToken(doctor._id));
    res.status(201).json({ message: "Doctor registered successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN DOCTOR =================
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const match = await bcrypt.compare(password, doctor.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    res.cookie("doctorToken", generateToken(doctor._id));
    res.status(200).json({ message: "Login successful", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    });

    res.json({ message: "Doctor profile updated", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
