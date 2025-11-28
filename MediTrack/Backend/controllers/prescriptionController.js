import Prescription from "../models/prescription.js";
import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";

// ================= CREATE PRESCRIPTION =================
export const createPrescription = async (req, res) => {
  try {
    const { patientId, medicines, diagnosis, notes } = req.body;

    // check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient)
      return res.status(404).json({ message: "Patient not found" });

    const prescription = await Prescription.create({
      doctor: req.doctorId,
      patient: patientId,
      medicines,
      diagnosis,
      notes,
    });

    res.status(201).json({ message: "Prescription created", prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL PRESCRIPTIONS OF DOCTOR =================
export const getAllPrescriptionsForDoctor = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.doctorId })
      .populate("patient", "name email");

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL PRESCRIPTIONS FOR PATIENT =================
export const getPrescriptionsForPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.patientId })
      .populate("doctor", "name email specialization");

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET SINGLE PRESCRIPTION =================
export const getSinglePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("doctor", "name email")
      .populate("patient", "name email");

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    if (!prescription)
      return res.status(403).json({ message: "Not allowed to modify" });

    res.json({ message: "Updated", prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
