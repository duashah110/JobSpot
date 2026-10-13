
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRolePopup, setShowRolePopup] = useState(false);

  // Read logged-in user
  const getLoggedInUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const user = getLoggedInUser();

  const userRole = String(
    user.role ||
    user.userRole ||
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    ""
  )
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const isEmployer = userRole === "employer";

  // Navigate according to user role
  const goToDashboard = () => {
    if (isEmployer) {
      navigate("/employer");
    } else {
      navigate("/dashboard");
    }
  };

  // Load job details
  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/jobs/${id}`);
        setJob(response.data.job);
      } catch (err) {
        console.error("Job details error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load job details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  // Handle Apply Now
  const handleApply = () => {
    if (isEmployer) {
      setShowRolePopup(true);
      return;
    }

    if (
      ["job_seeker", "jobseeker", "seeker"].includes(userRole)
    ) {
      navigate(`/jobs/${job.id}/apply`);
      return;
    }

    setShowRolePopup(true);
  };

  // Header
  const Header = () => (
    <header className="job-details-header">
      <div
        className="jobs-logo"
        onClick={goToDashboard}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") goToDashboard();
        }}
      >
        <div className="jobs-logo-icon">J</div>
        <span>JobSpot</span>
      </div>

      <button
        type="button"
        className="details-dashboard-button"
        onClick={goToDashboard}
      >
        Dashboard
      </button>
    </header>
  );

  // Loading
  if (loading) {
    return (
      <div className="job-details-page">
        <Header />

        <div className="job-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !job) {
    return (
      <div className="job-details-page">
        <Header />

        <div className="job-details-error">
          <div className="error-icon">!</div>

          <h2>Job not found</h2>

          <p>
            {error || "This job may have been removed."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/find-jobs")}
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <Header />

      <main className="job-details-container">
        <button
          type="button"
          className="back-jobs-button"
          onClick={() => navigate("/find-jobs")}
        >
          ← Back to all jobs
        </button>

        {/* Job Hero */}
        <section className="job-details-hero">
          <div className="job-details-company-icon">
            {job.company_name?.charAt(0).toUpperCase() || "C"}
          </div>

          <div className="job-details-title">
            <p>{job.company_name}</p>

            <h1>{job.title}</h1>

            <div className="job-details-meta">
              <span>📍 {job.location || "Remote"}</span>
              <span>💼 {job.job_type}</span>
              <span>◆ {job.category || "General"}</span>
            </div>
          </div>
        </section>

        {/* Job Content */}
        <div className="job-details-grid">
          <div className="job-details-main">
            <section className="details-section">
              <h2>Job Description</h2>
              <p>{job.description}</p>
            </section>

            <section className="details-section">
              <h2>Requirements</h2>

              {job.requirements ? (
                <div className="requirements-text">
                  {job.requirements}
                </div>
              ) : (
                <p>
                  No specific requirements were provided by
                  the employer.
                </p>
              )}
            </section>

            <section className="details-section">
              <h2>About this opportunity</h2>

              <p>
                This position is currently available on
                JobSpot. Review the job information carefully
                before submitting your application.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="job-details-sidebar">
            <div className="apply-card">
              <h3>Interested in this job?</h3>

              <p>
                Take the next step and submit your application
                to the employer.
              </p>

              <button
                type="button"
                className="apply-button"
                onClick={handleApply}
              >
                Apply Now →
              </button>

              <button
                type="button"
                className="save-details-button"
                onClick={() => navigate("/find-jobs")}
              >
                ♡ Save Job
              </button>
            </div>

            <div className="job-info-card">
              <h3>Job Information</h3>

              {(job.salary_min || job.salary_max) && (
                <div className="info-row">
                  <span>Salary</span>

                  <strong>
                    Rs.{" "}
                    {job.salary_min
                      ? Number(job.salary_min).toLocaleString()
                      : "0"}
                    {" - "}
                    Rs.{" "}
                    {job.salary_max
                      ? Number(job.salary_max).toLocaleString()
                      : "Negotiable"}
                  </strong>
                </div>
              )}

              <div className="info-row">
                <span>Job Type</span>
                <strong>{job.job_type}</strong>
              </div>

              <div className="info-row">
                <span>Location</span>
                <strong>{job.location || "Remote"}</strong>
              </div>

              <div className="info-row">
                <span>Category</span>
                <strong>{job.category || "General"}</strong>
              </div>

              {job.deadline && (
                <div className="info-row">
                  <span>Application Deadline</span>

                  <strong>
                    {new Date(job.deadline).toLocaleDateString()}
                  </strong>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Role Restriction Popup */}
      {showRolePopup && (
        <div
          className="role-popup-overlay"
          onClick={() => setShowRolePopup(false)}
        >
          <div
            className="role-popup"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-popup-title"
          >
            <div className="role-popup-icon">!</div>

            <h2 id="role-popup-title">Access Restricted</h2>

            <p>
              Only job seekers can apply for jobs.
              Please log in with a job seeker account
              to submit an application.
            </p>

            <button
              type="button"
              className="role-popup-button"
              onClick={() => setShowRolePopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;