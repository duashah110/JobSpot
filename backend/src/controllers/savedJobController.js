
const db = require("../config/db");

const {
  getSavedJobsByUserId,
  saveJob,
  removeSavedJob,
  checkSavedJob
} = require("../models/savedJobModel");

const getMySavedJobs = async (req, res) => {
  try {
    const jobs = await getSavedJobsByUserId(req.user.id);

    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error("Get saved jobs error:", error);

    res.status(500).json({
      message: "Failed to fetch saved jobs"
    });
  }
};

const addSavedJob = async (req, res) => {
  try {
    if (req.user.role !== "job_seeker") {
      return res.status(403).json({
        message: "Only job seekers can save jobs"
      });
    }

    const jobId = Number(req.body.job_id);

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return res.status(400).json({
        message: "A valid job ID is required"
      });
    }

    const [jobs] = await db.query(
      "SELECT id FROM jobs WHERE id = ?",
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const alreadySaved = await checkSavedJob(
      req.user.id,
      jobId
    );

    if (alreadySaved) {
      return res.status(409).json({
        message: "Job is already saved"
      });
    }

    await saveJob(req.user.id, jobId);

    res.status(201).json({
      message: "Job saved successfully"
    });
  } catch (error) {
    console.error("Save job error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Job is already saved"
      });
    }

    res.status(500).json({
      message: "Failed to save job"
    });
  }
};

const deleteSavedJob = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return res.status(400).json({
        message: "A valid job ID is required"
      });
    }

    const result = await removeSavedJob(
      req.user.id,
      jobId
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Saved job not found"
      });
    }

    res.json({
      message: "Saved job removed successfully"
    });
  } catch (error) {
    console.error("Remove saved job error:", error);

    res.status(500).json({
      message: "Failed to remove saved job"
    });
  }
};

module.exports = {
  getMySavedJobs,
  addSavedJob,
  deleteSavedJob
};