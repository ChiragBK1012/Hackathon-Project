import express from "express";
import { addPatient, getPatients } from "../controllers/patientAddController.js";
import { protectDoctor } from "../middlewares/authDoctor.js";

const router = express.Router();

// Protected route: only logged-in doctors can add patients
router.post("/", protectDoctor, addPatient);

// Get all patients added by this doctor
router.get("/", protectDoctor, getPatients);

export default router;
