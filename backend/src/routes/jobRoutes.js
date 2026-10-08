const express = require("express");

const {
  getJobs,
  getSingleJob,
  addJob
} = require("../controllers/jobController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getSingleJob);
router.post("/", authenticateToken, addJob);

module.exports = router;
