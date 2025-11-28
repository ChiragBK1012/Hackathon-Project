const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { addReminder } = require("../controllers/reminderController");

router.post("/add", auth, addReminder);

module.exports = router;
