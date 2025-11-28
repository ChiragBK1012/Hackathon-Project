// Backend/routes/patientAddRoute.js
import express from "express";
import {
    addPatient,
    getPatients,
} from "../controllers/patientAddController.js";
import { protectDoctor } from "../middlewares/authDoctor.js";

const router = express.Router();

// POST /api/doctor/patients  -> add a patient
router.post("/", protectDoctor, addPatient);

// GET /api/doctor/patients  -> get all added patients
router.get("/", protectDoctor, getPatients);

export default router;
