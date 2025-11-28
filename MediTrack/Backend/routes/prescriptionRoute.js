// Backend/routes/prescriptionRoute.js
import express from "express";
import {
    createPrescription,
    getAllPrescriptionsForDoctor,
    getPrescriptionsForPatient,
    getSinglePrescription,
    updatePrescription,
} from "../controllers/prescriptionController.js";

import { protectDoctor } from "../middlewares/authDoctor.js";
import { protectPatient } from "../middlewares/authPatient.js";

const router = express.Router();

/* ------------------------- DOCTOR PROTECTED ROUTES ------------------------- */

// Doctor creates prescription
router.post("/create", protectDoctor, createPrescription);

// Doctor views prescriptions they wrote
router.get("/doctor/all", protectDoctor, getAllPrescriptionsForDoctor);

// Doctor updates a prescription
router.put("/:id", protectDoctor, updatePrescription);

/* ------------------------- PATIENT PROTECTED ROUTES ------------------------- */

// Patient views their own prescriptions
router.get("/patient/all", protectPatient, getPrescriptionsForPatient);

/* ------------------------- COMMON ROUTE ------------------------- */

// Both doctor + patient (or even public) can view a single prescription
router.get("/:id", getSinglePrescription);

export default router;
