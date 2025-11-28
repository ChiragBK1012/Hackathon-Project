const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
    createOrUpdateProfile,
    getProfile,
    getMyReminders,
} = require("../controllers/patientController");

router.post("/profile", auth, createOrUpdateProfile);
router.get("/profile", auth, getProfile);
router.get("/reminders", auth, getMyReminders);

module.exports = router;
