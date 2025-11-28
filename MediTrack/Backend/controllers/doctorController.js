const Patient = require("../models/patient");

exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({ doctorId: req.user.id });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
