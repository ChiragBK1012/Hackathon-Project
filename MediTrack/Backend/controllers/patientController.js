import Patient from "../models/patient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (patientId) => {
  return jwt.sign({ patientId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= REGISTER PATIENT =================
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    const exist = await Patient.findOne({ email });
    if (exist) return res.status(409).json({ message: "Patient already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
    });

    res.cookie("patientToken", generateToken(patient._id));
    res.status(201).json({ message: "Patient registered", patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN PATIENT =================
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const match = await bcrypt.compare(password, patient.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    res.cookie("patientToken", generateToken(patient._id));
    res.status(200).json({ message: "Login successful", patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const patient = await Patient.findByIdAndUpdate(req.patientId, updates, {
      new: true,
    });

    res.json({ message: "Patient profile updated", patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
