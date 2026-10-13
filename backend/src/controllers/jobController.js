
const {
  getAllJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getEmployerStats
} = require("../models/jobModel");

const db = require("../config/db");

const getJobs = async (req, res) => {
  try {
    const jobs = await getAllJobs();

    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      message: "Failed to fetch jobs"
    });
  }
};

const getSingleJob = async (req, res) => {
  try {
    const job = await getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error("Get single job error:", error);
    res.status(500).json({
      message: "Failed to fetch job"
    });
  }
};


const addJob = async (req, res) => {
  try {
    const userId = req.user.id;

    // Only employers can post jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can post jobs"
      });
    }

    const {
      title,
      description,
      requirements,
      location,
      job_type,
      category,
      salary_min,
      salary_max,
      deadline
    } = req.body;

    // Required fields validation
    if (!title || !description || !job_type) {
      return res.status(400).json({
        message: "Title, description and job type are required"
      });
    }

    // Validate salary range
    if (
      salary_min !== undefined &&
      salary_min !== null &&
      salary_min !== "" &&
      salary_max !== undefined &&
      salary_max !== null &&
      salary_max !== "" &&
      Number(salary_min) > Number(salary_max)
    ) {
      return res.status(400).json({
        message: "Minimum salary cannot exceed maximum salary"
      });
    }

    // Validate application deadline
    if (deadline && deadline < new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({
        message: "Application deadline cannot be in the past"
      });
    }

    // Find employer's company
    const [companies] = await db.query(
      "SELECT id FROM companies WHERE user_id = ?",
      [userId]
    );

    if (companies.length === 0) {
      return res.status(404).json({
        message: "Please create a company profile first"
      });
    }

    // Create job
    const result = await createJob(
      companies[0].id,
      title,
      description,
      requirements || null,
      location || null,
      job_type,
      category || null,
      salary_min === "" || salary_min == null
        ? null
        : Number(salary_min),
      salary_max === "" || salary_max == null
        ? null
        : Number(salary_max),
      deadline || null
    );

    return res.status(201).json({
      message: "Job created successfully",
      jobId: result.insertId
    });

  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      message: "Failed to create job"
    });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can manage jobs"
      });
    }

    const jobs = await getMyJobs(req.user.id);

    return res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error("Get employer jobs error:", error);

    return res.status(500).json({
      message: "Failed to fetch your jobs"
    });
  }
};

const editJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can edit jobs"
      });
    }

    const {
      title,
      description,
      requirements,
      location,
      job_type,
      category,
      salary_min,
      salary_max,
      deadline
    } = req.body;

    if (!title || !description || !job_type) {
      return res.status(400).json({
        message: "Title, description and job type are required"
      });
    }

    const min = salary_min === "" || salary_min == null
      ? null
      : Number(salary_min);

    const max = salary_max === "" || salary_max == null
      ? null
      : Number(salary_max);

    if (
      (min !== null && (!Number.isFinite(min) || min < 0)) ||
      (max !== null && (!Number.isFinite(max) || max < 0))
    ) {
      return res.status(400).json({
        message: "Salary must be a valid non-negative number"
      });
    }

    if (min !== null && max !== null && min > max) {
      return res.status(400).json({
        message: "Minimum salary cannot exceed maximum salary"
      });
    }

    if (deadline && deadline < new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({
        message: "Application deadline cannot be in the past"
      });
    }

    // Check ownership before updating
    const employerJobs = await getMyJobs(req.user.id);
    const ownsJob = employerJobs.some(
      (job) => Number(job.id) === Number(req.params.id)
    );

    if (!ownsJob) {
      return res.status(404).json({
        message: "Job not found or you do not have permission to edit it"
      });
    }

    await updateJob(req.params.id, req.user.id, {
      title: title.trim(),
      description: description.trim(),
      requirements,
      location,
      job_type,
      category,
      salary_min: min,
      salary_max: max,
      deadline
    });

    return res.json({
      success: true,
      message: "Job updated successfully"
    });
  } catch (error) {
    console.error("Update job error:", error);

    return res.status(500).json({
      message: "Failed to update job"
    });
  }
};

const removeJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can delete jobs"
      });
    }

    const result = await deleteJob(req.params.id, req.user.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Job not found or you do not have permission to delete it"
      });
    }

    return res.json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.error("Delete job error:", error);

    // Existing applications or saved jobs may prevent deletion
    if (error.code === "ER_ROW_IS_REFERENCED_2" ||
        error.code === "ER_ROW_IS_REFERENCED") {
      return res.status(409).json({
        message: "This job has applications or saved records and cannot be deleted. Please keep it or deactivate it instead."
      });
    }

    return res.status(500).json({
      message: "Failed to delete job"
    });
  }
};

const getEmployerDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can view these statistics"
      });
    }

    const stats = await getEmployerStats(req.user.id);

    return res.json({
      success: true,
      stats: {
        totalJobs: Number(stats.totalJobs || 0),
        activeJobs: Number(stats.activeJobs || 0),
        totalApplications: Number(stats.totalApplications || 0),
        shortlistedCandidates: Number(
          stats.shortlistedCandidates || 0
        )
      }
    });
  } catch (error) {
    console.error("Employer dashboard stats error:", error);

    return res.status(500).json({
      message: "Failed to load dashboard statistics"
    });
  }
};
module.exports = {
  getJobs,
  getSingleJob,
  addJob,
  getEmployerJobs,
  editJob,
  removeJob,
  getEmployerDashboardStats
};