const db = require("../config/db");

const createApplication = async (
  jobId,
  userId,
  resume,
  coverLetter
) => {
  const [result] = await db.query(
    `INSERT INTO applications
     (job_id, user_id, resume, cover_letter)
     VALUES (?, ?, ?, ?)`,
    [jobId, userId, resume, coverLetter]
  );

  return result;
};

const getApplicationsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT
      applications.*,
      jobs.title,
      jobs.location,
      jobs.job_type,
      jobs.category,
      companies.company_name
     FROM applications
     INNER JOIN jobs
       ON applications.job_id = jobs.id
     INNER JOIN companies
       ON jobs.company_id = companies.id
     WHERE applications.user_id = ?
     ORDER BY applications.applied_at DESC`,
    [userId]
  );

  return rows;
};

const getApplicationByJobAndUser = async (jobId, userId) => {
  const [rows] = await db.query(
    `SELECT *
     FROM applications
     WHERE job_id = ?
     AND user_id = ?`,
    [jobId, userId]
  );

  return rows[0];
};

module.exports = {
  createApplication,
  getApplicationsByUserId,
  getApplicationByJobAndUser
};
