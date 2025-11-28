const Reminder = require("../models/reminder");

exports.getMyReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ patientId: req.user.id });
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
