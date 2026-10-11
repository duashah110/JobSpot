
const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus
} = require("../controllers/applicationController");

const authenticateToken =
  require("../middleware/authMiddleware");

const upload =
  require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  upload.single("resume"),
  applyForJob
);

// Job seeker's own applications
router.get(
  "/my-applications",
  authenticateToken,
  getMyApplications
);

// Applications for jobs posted by this employer
router.get(
  "/employer",
  authenticateToken,
  getEmployerApplications
);

// Update an application's status
router.patch(
  "/:id/status",
  authenticateToken,
  updateApplicationStatus
);

module.exports = router;
