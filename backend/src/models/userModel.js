const db = require("../config/db");

const createUser = async (name, email, hashedPassword, role) => {
  const [result] = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, role]
  );

  return result;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail
};
