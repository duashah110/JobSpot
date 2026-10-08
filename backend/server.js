const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const companyRoutes = require("./src/routes/companyRoutes");
const applicationRoutes =
  require("./src/routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "JobSpot API is running ??"
  });
});

app.get("/db-test", async (req, res) => {
  try {
    const [result] =
      await db.query("SELECT 1 AS test");

    res.json({
      message: "Database connected successfully ?",
      result
    });
  } catch (error) {
    console.error(
      "Database connection error:",
      error
    );

    res.status(500).json({
      message: "Database connection failed ?"
    });
  }
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `JobSpot server running on port ${PORT}`
  );
});
