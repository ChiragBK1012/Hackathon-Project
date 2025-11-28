import express from "express";
import { 
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile
} from "../controllers/doctorController.js";

import { protectDoctor } from "../middlewares/authDoctor.js";

const router = express.Router();

// Public Routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);

// Protected Routes
router.get("/profile", protectDoctor, getDoctorProfile);
router.put("/profile", protectDoctor, updateDoctorProfile);

export default router;
