const express = require("express");

const {
  applyForJob,
  getMyApplications
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

router.get(
  "/my-applications",
  authenticateToken,
  getMyApplications
);

module.exports = router;
