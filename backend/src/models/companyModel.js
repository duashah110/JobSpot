
const db = require("../config/db");

const getCompanyByUserId = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM companies WHERE user_id = ?",
    [userId]
  );

  return rows[0];
};

const createCompany = async (
  userId,
  companyName,
  description,
  website,
  location,
  logo
) => {
  const [result] = await db.query(
    `INSERT INTO companies
     (user_id, company_name, description, website, location, logo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, companyName, description, website, location, logo]
  );

  return result;
};

const updateCompany = async (
  userId,
  companyName,
  description,
  website,
  location,
  logo
) => {
  const [result] = await db.query(
    `UPDATE companies
     SET company_name = ?,
         description = ?,
         website = ?,
         location = ?,
         logo = ?
     WHERE user_id = ?`,
    [
      companyName,
      description,
      website,
      location,
      logo,
      userId,
    ]
  );

  return result;
};

module.exports = {
  getCompanyByUserId,
  createCompany,
  updateCompany,
};