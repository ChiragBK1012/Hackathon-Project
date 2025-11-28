// Backend/models/doctorAddPatient.js
import mongoose from "mongoose";

const addedPatientSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        name: String,
        age: Number,
        gender: String,
        contact: String,
        conditions: [String],
    },
    { timestamps: true }
);

export default mongoose.model("AddedPatient", addedPatientSchema);
