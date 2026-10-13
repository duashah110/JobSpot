const db = require("../config/db");

const getAllJobs = async () => {
  const [rows] = await db.query(`
    SELECT
      jobs.*,
      companies.company_name,
      companies.logo
    FROM jobs
    INNER JOIN companies
      ON jobs.company_id = companies.id
    ORDER BY jobs.created_at DESC
  `);

  return rows;
};

const getJobById = async (id) => {
  const [rows] = await db.query(
    `SELECT
      jobs.*,
      companies.company_name,
      companies.logo,
      companies.location AS company_location
     FROM jobs
     INNER JOIN companies
       ON jobs.company_id = companies.id
     WHERE jobs.id = ?`,
    [id]
  );

  return rows[0];
};

const createJob = async (
  companyId,
  title,
  description,
  requirements,
  location,
  jobType,
  category,
  salaryMin,
  salaryMax,
  deadline
) => {
  const [result] = await db.query(
    `INSERT INTO jobs
      (company_id, title, description, requirements, location,
       job_type, category, salary_min, salary_max, deadline)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      companyId,
      title,
      description,
      requirements,
      location,
      jobType,
      category,
      salaryMin,
      salaryMax,
      deadline
    ]
  );

  return result;
};

// Get only the jobs posted by the logged-in employer
const getMyJobs = async (userId) => {
  const [rows] = await db.query(
    `SELECT
       jobs.*,
       companies.company_name,
       companies.logo
     FROM jobs
     INNER JOIN companies
       ON jobs.company_id = companies.id
     WHERE companies.user_id = ?
     ORDER BY jobs.created_at DESC`,
    [userId]
  );

  return rows;
};

// Update a job only if it belongs to this employer
const updateJob = async (jobId, userId, jobData) => {
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
  } = jobData;

  const [result] = await db.query(
    `UPDATE jobs
     INNER JOIN companies
       ON jobs.company_id = companies.id
     SET
       jobs.title = ?,
       jobs.description = ?,
       jobs.requirements = ?,
       jobs.location = ?,
       jobs.job_type = ?,
       jobs.category = ?,
       jobs.salary_min = ?,
       jobs.salary_max = ?,
       jobs.deadline = ?
     WHERE jobs.id = ?
       AND companies.user_id = ?`,
    [
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
      deadline || null,
      jobId,
      userId
    ]
  );

  return result;
};

// Delete only a job belonging to this employer
const deleteJob = async (jobId, userId) => {
  const [result] = await db.query(
    `DELETE jobs
     FROM jobs
     INNER JOIN companies
       ON jobs.company_id = companies.id
     WHERE jobs.id = ?
       AND companies.user_id = ?`,
    [jobId, userId]
  );

  return result;
};

const getEmployerStats = async (userId) => {
  const [rows] = await db.query(
    `SELECT
       COUNT(DISTINCT jobs.id) AS totalJobs,

       COUNT(DISTINCT CASE
         WHEN jobs.deadline IS NULL
           OR jobs.deadline >= CURDATE()
         THEN jobs.id
       END) AS activeJobs,

       COUNT(applications.id) AS totalApplications,

       COALESCE(SUM(
         CASE
           WHEN LOWER(applications.status) = 'shortlisted'
           THEN 1
           ELSE 0
         END
       ), 0) AS shortlistedCandidates

     FROM companies
     LEFT JOIN jobs
       ON jobs.company_id = companies.id
     LEFT JOIN applications
       ON applications.job_id = jobs.id
     WHERE companies.user_id = ?`,
    [userId]
  );

  return rows[0];
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getEmployerStats
};