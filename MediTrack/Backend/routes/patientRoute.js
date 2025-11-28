import express from "express";
import { 
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile
} from "../controllers/patientController.js";

import { protectPatient } from "../middlewares/authPatient.js";

const router = express.Router();

// Public Routes
router.post("/register", registerPatient);
router.post("/login", loginPatient);

// Protected Routes
router.get("/profile", protectPatient, getPatientProfile);
router.put("/profile", protectPatient, updatePatientProfile);

export default router;
