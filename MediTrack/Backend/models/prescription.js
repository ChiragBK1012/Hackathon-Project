import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },

    medicines: [
        {
            name: String,
            dosage: String,
            time: [String],          // ["Morning", "Night"]
            durationInDays: Number,
            instructions: String
        }
    ],

    diagnosis: String,
    notes: String
}, { timestamps: true });

export default mongoose.model("Prescription", prescriptionSchema);
