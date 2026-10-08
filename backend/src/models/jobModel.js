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

module.exports = {
  getAllJobs,
  getJobById,
  createJob
};
