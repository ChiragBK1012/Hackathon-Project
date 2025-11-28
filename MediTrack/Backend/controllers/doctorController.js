const Patient = require("../models/patient");
const User = require("../models/user");

exports.getPatients = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Try to read from Patient collection and populate user info if present
        const patientRecords = await Patient.find({ doctorId }).populate("userId", "name email");

        if (patientRecords && patientRecords.length > 0) {
            // return a combined view (prefer user info if available)
            const patients = patientRecords.map((pr) => ({
                _id: pr.userId?._id || pr._id,
                name: pr.userId?.name,
                email: pr.userId?.email,
                age: pr.age,
                contact: pr.contact,
                conditions: pr.conditions,
                doctorId: pr.doctorId,
            }));

            return res.json(patients);
        }

        // Fallback: if patients are stored only in User model (role: 'patient'), return them
        const users = await User.find({ role: "patient" }).select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
