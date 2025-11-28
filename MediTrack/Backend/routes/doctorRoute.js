const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { getPatients } = require("../controllers/doctorController");

router.get("/patients", auth, getPatients);

module.exports = router;
