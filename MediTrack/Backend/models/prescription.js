// Backend/models/prescription.js
import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        time: [String], // ["09:00", "15:00"]
        durationInDays: Number,
        instructions: String,
    },
    { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        medicines: [medicineSchema],

        diagnosis: String,
        notes: String,
    },
    { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
