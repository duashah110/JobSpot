
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const companyRoutes = require("./src/routes/companyRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const savedJobRoutes = require("./src/routes/savedJobRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded resumes and other uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);

// Temporary route test
app.get("/api-test", (req, res) => {
  res.json({
    success: true,
    message: "JobSpot server is working"
  });
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "JobSpot API is running"
  });
});

// Database connection test
app.get("/db-test", async (req, res) => {
  try {
    const [result] = await db.query("SELECT 1 AS test");

    res.json({
      success: true,
      message: "Database connected successfully",
      result
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// Start server — only one PORT and one app.listen()
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`JobSpot server running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Server startup error:", error);
});
