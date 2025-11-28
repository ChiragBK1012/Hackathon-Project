import AddedPatient from "../models/doctorAddPatient.js";

// Add a patient (doctor must be logged in)
export const addPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, conditions } = req.body;

    // doctorId comes from middleware
    const doctorId = req.doctorId;

    const newPatient = new AddedPatient({
      doctorId,
      name,
      age,
      gender,
      contact,
      conditions
    });

    await newPatient.save();

    res.status(201).json({ message: "Patient added successfully", patient: newPatient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all patients added by the logged-in doctor
export const getPatients = async (req, res) => {
  try {
    const doctorId = req.doctorId;

    const patients = await AddedPatient.find({ doctorId });

    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
