const {
  getAllJobs,
  getJobById,
  createJob
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

    const [companies] = await db.query(
      "SELECT id FROM companies WHERE user_id = ?",
      [userId]
    );

    if (companies.length === 0) {
      return res.status(404).json({
        message: "Please create a company profile first"
      });
    }

    const result = await createJob(
      companies[0].id,
      title,
      description,
      requirements || null,
      location || null,
      job_type,
      category || null,
      salary_min || null,
      salary_max || null,
      deadline || null
    );

    res.status(201).json({
      message: "Job created successfully",
      jobId: result.insertId
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({
      message: "Failed to create job"
    });
  }
};

module.exports = {
  getJobs,
  getSingleJob,
  addJob
};
