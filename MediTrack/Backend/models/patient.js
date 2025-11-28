import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    age: Number,
    gender: String,
    contact: String,
    conditions: [String],

    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);
