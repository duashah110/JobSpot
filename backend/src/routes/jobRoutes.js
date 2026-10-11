
const express = require("express");

const {
  getJobs,
  getSingleJob,
  addJob,
  getEmployerJobs,
  editJob,
  removeJob
} = require("../controllers/jobController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public job listings
router.get("/", getJobs);

// Employer's own jobs — keep this before /:id
router.get("/my-jobs", authenticateToken, getEmployerJobs);

// Single job details
router.get("/:id", getSingleJob);

// Create, edit and delete jobs
router.post("/", authenticateToken, addJob);
router.put("/:id", authenticateToken, editJob);
router.delete("/:id", authenticateToken, removeJob);

module.exports = router;
