const Reminder = require("../models/reminder");
const Patient = require("../models/patient");
const User = require("../models/user");

exports.getMyReminders = async (req, res) => {
    try {
        const userId = req.user.id;

        // First try: reminders where patientId equals the user id
        let reminders = await Reminder.find({ patientId: userId }).populate(
            "doctorId",
            "name email"
        );

        // If none found, try finding a Patient doc for this user and search by that _id
        if (!reminders || reminders.length === 0) {
            const patientDoc = await Patient.findOne({ userId });
            if (patientDoc) {
                reminders = await Reminder.find({ patientId: patientDoc._id })
                    .populate("doctorId", "name email")
                    .populate({ path: "patientId", populate: { path: "userId", select: "name email" } });
            }
        } else {
            // If reminders were found by userId, attach basic patient info from User model
            const user = await User.findById(userId).select("name email");
            reminders = reminders.map((r) => ({ ...r.toObject(), patientInfo: user }));
        }

        // Ensure we return an array (empty if nothing found)
        return res.json(reminders || []);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.createOrUpdateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { age, contact, conditions, doctorId } = req.body;

        // Upsert patient profile linked to userId
        const update = {
            role: "patient",
            age: age || undefined,
            contact: contact || undefined,
            conditions: Array.isArray(conditions) ? conditions : conditions ? [conditions] : [],
            doctorId: doctorId || undefined,
            updatedAt: Date.now(),
        };

        const patient = await Patient.findOneAndUpdate(
            { userId },
            { $set: update, $setOnInsert: { userId } },
            { new: true, upsert: true }
        );

        res.json({ msg: "Patient profile saved", patient });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const patient = await Patient.findOne({ userId }).populate("userId", "name email");
        if (!patient) return res.status(404).json({ msg: "Patient profile not found" });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
