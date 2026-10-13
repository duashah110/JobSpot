
const express = require("express");

const {
  getJobs,
  getSingleJob,
  addJob,
  getEmployerJobs,
  editJob,
  removeJob,
  getEmployerDashboardStats
} = require("../controllers/jobController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/test-route", (req, res) => {
  res.json({
    success: true,
    message: "Job routes are working"
  });
});

// Public job listings
router.get("/", getJobs);

// Employer dashboard statistics — BEFORE /:id
router.get(
  "/employer-stats",
  authenticateToken,
  getEmployerDashboardStats
);

// Employer's own jobs
router.get("/my-jobs", authenticateToken, getEmployerJobs);

// Single job details
router.get("/:id", getSingleJob);

// Create job
router.post("/", authenticateToken, addJob);

// Edit job
router.put("/:id", authenticateToken, editJob);

// Delete job
router.delete("/:id", authenticateToken, removeJob);

module.exports = router;
