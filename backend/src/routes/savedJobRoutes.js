
const express = require("express");

const {
  getMySavedJobs,
  addSavedJob,
  deleteSavedJob
} = require("../controllers/savedJobController");

const authenticateToken =
  require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  getMySavedJobs
);

router.post(
  "/",
  authenticateToken,
  addSavedJob
);

router.delete(
  "/:jobId",
  authenticateToken,
  deleteSavedJob
);

module.exports = router;