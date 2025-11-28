const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    medicineName: String,
    dosage: String,
    frequency: Number,
    timings: [String],
    instructions: String,
    duration: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reminder", reminderSchema);
