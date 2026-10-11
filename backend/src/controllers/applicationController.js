const {
  createApplication,
  getApplicationsByUserId,
  getApplicationByJobAndUser,
  getApplicationsForEmployer,
  updateEmployerApplicationStatus
} = require("../models/applicationModel");

const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const applyForJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { job_id, cover_letter } = req.body;

    if (req.user.role !== "job_seeker") {
      return res.status(403).json({
        message: "Only job seekers can apply for jobs"
      });
    }

    if (!job_id) {
      return res.status(400).json({
        message: "Job ID is required"
      });
    }

    if (!cover_letter || !cover_letter.trim()) {
      return res.status(400).json({
        message: "Cover letter is required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Resume is required"
      });
    }

    const [jobs] = await db.query(
      "SELECT id, deadline FROM jobs WHERE id = ?",
      [job_id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (jobs[0].deadline) {
      const today = new Date();
      const deadline = new Date(jobs[0].deadline);

      if (today > deadline) {
        return res.status(400).json({
          message: "Application deadline has passed"
        });
      }
    }

    const existingApplication =
      await getApplicationByJobAndUser(job_id, userId);

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job"
      });
    }

    const resumePath =
      `/uploads/resumes/${req.file.filename}`;

    const result = await createApplication(
      job_id,
      userId,
      resumePath,
      cover_letter
    );

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: result.insertId,
      resume: resumePath
    });

  } catch (error) {
    console.error("Apply for job error:", error);

    if (req.file) {
      const uploadedFile = path.join(
        __dirname,
        "../../uploads/resumes",
        req.file.filename
      );

      if (fs.existsSync(uploadedFile)) {
        fs.unlinkSync(uploadedFile);
      }
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "You have already applied for this job"
      });
    }

    res.status(500).json({
      message: "Failed to submit application"
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications =
      await getApplicationsByUserId(req.user.id);

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      message: "Failed to fetch applications"
    });
  }
};

const getEmployerApplications = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can view received applications"
      });
    }

    const applications =
      await getApplicationsForEmployer(req.user.id);

    return res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error("Get employer applications error:", error);

    return res.status(500).json({
      message: "Failed to fetch employer applications"
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can update application status"
      });
    }

    const { status } = req.body;
    const allowedStatuses = [
      "Pending",
      "Reviewed",
      "Shortlisted",
      "Rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status"
      });
    }

    const result = await updateEmployerApplicationStatus(
      req.params.id,
      req.user.id,
      status
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Application not found for your company"
      });
    }

    return res.json({
      success: true,
      message: "Application status updated successfully"
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      message: "Failed to update application status"
    });
  }
};


module.exports = {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus
};
