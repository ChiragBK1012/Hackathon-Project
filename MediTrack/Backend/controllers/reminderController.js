const Reminder = require("../models/reminder");

exports.addReminder = async (req, res) => {
    try {
        const reminder = await Reminder.create({
            ...req.body,
            doctorId: req.user.id,
        });

        res.json({ msg: "Reminder created", reminder });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
