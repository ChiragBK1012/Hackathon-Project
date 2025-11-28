const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, age, contact, conditions, doctorId } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
            role,
        });

        // If the registered user is a patient (or patient profile data was provided), create or upsert a Patient profile document
        const shouldCreatePatient = role === "patient" || age || contact || (conditions && conditions.length) || doctorId;

        if (shouldCreatePatient) {
            try {
                const update = {
                    role: "patient",
                    age: age || undefined,
                    contact: contact || undefined,
                    conditions: Array.isArray(conditions) ? conditions : conditions ? [conditions] : [],
                    doctorId: doctorId || undefined,
                    updatedAt: Date.now(),
                };

                const patientDoc = await Patient.findOneAndUpdate(
                    { userId: user._id },
                    { $set: update, $setOnInsert: { userId: user._id, createdAt: Date.now() } },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );

                return res.status(201).json({ msg: "User registered", user, patient: patientDoc });
            } catch (pErr) {
                // If patient creation fails, still return user created but warn
                return res.status(201).json({ msg: "User registered (patient profile failed)", user, patientError: pErr.message });
            }
        }

        res.json({ msg: "User registered", user });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Incorrect password" });

        const secret = process.env.JWT_SECRET;
        if (!secret)
            return res
                .status(500)
                .json({ msg: "JWT_SECRET not set in environment (create a .env file)" });

        const token = jwt.sign({ id: user._id, role: user.role }, secret, {
            expiresIn: "7d",
        });

        // Set token in HTTP-only cookie for secure storage on client
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        res.cookie("token", token, cookieOptions);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
