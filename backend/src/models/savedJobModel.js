
const db = require("../config/db");

const getSavedJobsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT
      saved_jobs.id AS saved_id,
      saved_jobs.saved_at,
      jobs.id AS job_id,
      jobs.title,
      jobs.description,
      jobs.location,
      jobs.job_type,
      jobs.category,
      jobs.salary_min,
      jobs.salary_max,
      companies.company_name,
      companies.logo
    FROM saved_jobs
    INNER JOIN jobs
      ON saved_jobs.job_id = jobs.id
    INNER JOIN companies
      ON jobs.company_id = companies.id
    WHERE saved_jobs.user_id = ?
    ORDER BY saved_jobs.saved_at DESC`,
    [userId]
  );

  return rows;
};

const saveJob = async (userId, jobId) => {
  const [result] = await db.query(
    `INSERT INTO saved_jobs (user_id, job_id)
     VALUES (?, ?)`,
    [userId, jobId]
  );

  return result;
};

const removeSavedJob = async (userId, jobId) => {
  const [result] = await db.query(
    `DELETE FROM saved_jobs
     WHERE user_id = ? AND job_id = ?`,
    [userId, jobId]
  );

  return result;
};

const checkSavedJob = async (userId, jobId) => {
  const [rows] = await db.query(
    `SELECT id FROM saved_jobs
     WHERE user_id = ? AND job_id = ?`,
    [userId, jobId]
  );

  return rows.length > 0;
};

module.exports = {
  getSavedJobsByUserId,
  saveJob,
  removeSavedJob,
  checkSavedJob
};