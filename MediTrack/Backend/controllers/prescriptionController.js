// Backend/controllers/prescriptionController.js
import Prescription from "../models/prescription.js";
import Patient from "../models/patient.js";

// ================= CREATE PRESCRIPTION =================
export const createPrescription = async (req, res) => {
    try {
        const { patientId, medicines, diagnosis, notes } = req.body;

        if (!patientId || !medicines || !Array.isArray(medicines)) {
            return res
                .status(400)
                .json({ message: "patientId and medicines are required" });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const prescription = await Prescription.create({
            doctor: req.doctorId,
            patient: patientId,
            medicines,
            diagnosis,
            notes,
        });

        res.status(201).json({ message: "Prescription created", prescription });
    } catch (error) {
        console.error("Create prescription error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET ALL PRESCRIPTIONS OF DOCTOR =================
export const getAllPrescriptionsForDoctor = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctor: req.doctorId })
            .populate("patient", "name email")
            .sort({ createdAt: -1 });

        res.json(prescriptions);
    } catch (error) {
        console.error("Get doctor prescriptions error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET ALL PRESCRIPTIONS FOR PATIENT =================
export const getPrescriptionsForPatient = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({
            patient: req.patientId,
        })
            .populate("doctor", "name email specialization")
            .sort({ createdAt: -1 });

        res.json(prescriptions);
    } catch (error) {
        console.error("Get patient prescriptions error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET SINGLE PRESCRIPTION =================
export const getSinglePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate("doctor", "name email specialization")
            .populate("patient", "name email");

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        res.json(prescription);
    } catch (error) {
        console.error("Get single prescription error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= UPDATE PRESCRIPTION (Doctor only) =================
export const updatePrescription = async (req, res) => {
    try {
        const updates = req.body;

        const prescription = await Prescription.findOneAndUpdate(
            { _id: req.params.id, doctor: req.doctorId },
            updates,
            { new: true }
        );

        if (!prescription) {
            return res
                .status(403)
                .json({
                    message: "Not allowed to modify or prescription not found",
                });
        }

        res.json({ message: "Prescription updated", prescription });
    } catch (error) {
        console.error("Update prescription error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
