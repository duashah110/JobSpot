const express = require("express");

const {
  getMyCompany,
  addCompany
} = require("../controllers/companyController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my-company", authenticateToken, getMyCompany);
router.post("/", authenticateToken, addCompany);

module.exports = router;
