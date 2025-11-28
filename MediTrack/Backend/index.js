require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS and allow credentials (cookies).
// If you have a frontend URL, set CLIENT_URL in .env to restrict origin.
app.use(
	cors({ origin: process.env.CLIENT_URL || true, credentials: true })
);

connectDB();

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/doctor", require("./routes/doctorRoute"));
app.use("/api/reminder", require("./routes/reminderRoute"));
app.use("/api/patient", require("./routes/patientRoute"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
