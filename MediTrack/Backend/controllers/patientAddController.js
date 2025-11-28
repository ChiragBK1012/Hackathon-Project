// Backend/controllers/patientAddController.js
import AddedPatient from "../models/doctorAddPatient.js";

// Add a patient (doctor must be logged in)
export const addPatient = async (req, res) => {
    try {
        const { name, age, gender, contact, conditions } = req.body;
        const doctorId = req.doctorId; // from middleware

        if (!name) {
            return res
                .status(400)
                .json({ message: "Patient name is required" });
        }

        const newPatient = await AddedPatient.create({
            doctorId,
            name,
            age,
            gender,
            contact,
            conditions,
        });

        res.status(201).json({
            message: "Patient added successfully",
            patient: newPatient,
        });
    } catch (error) {
        console.error("Add patient error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all patients added by the logged-in doctor
export const getPatients = async (req, res) => {
    try {
        const doctorId = req.doctorId;

        const patients = await AddedPatient.find({ doctorId }).sort({
            createdAt: -1,
        });

        res.status(200).json(patients);
    } catch (error) {
        console.error("Get doctor patients error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
