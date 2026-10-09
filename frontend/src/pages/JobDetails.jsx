import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/jobs/${id}`);

      setJob(response.data.job);
    } catch (error) {
      console.error("Job details error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load job details"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-page">

        <div className="job-details-error">

          <div className="error-icon">
            !
          </div>

          <h2>
            Job not found
          </h2>

          <p>
            {error || "This job may have been removed."}
          </p>

          <button
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

      {/* Header */}

      <header className="job-details-header">

        <div
          className="jobs-logo"
          onClick={() => navigate("/dashboard")}
        >
          <div className="jobs-logo-icon">
            J
          </div>

          <span>
            JobSpot
          </span>
        </div>

        <button
          className="details-dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

      </header>


      {/* Main */}

      <main className="job-details-container">

        <button
          className="back-jobs-button"
          onClick={() => navigate("/find-jobs")}
        >
          ← Back to all jobs
        </button>


        {/* Job Hero */}

        <section className="job-details-hero">

          <div className="job-details-company-icon">
            {job.company_name
              ?.charAt(0)
              .toUpperCase() || "C"}
          </div>

          <div className="job-details-title">

            <p>
              {job.company_name}
            </p>

            <h1>
              {job.title}
            </h1>

            <div className="job-details-meta">

              <span>
                📍 {job.location || "Remote"}
              </span>

              <span>
                💼 {job.job_type}
              </span>

              <span>
                ◆ {job.category || "General"}
              </span>

            </div>

          </div>

        </section>


        {/* Content */}

        <div className="job-details-grid">

          {/* Left */}

          <div className="job-details-main">

            <section className="details-section">

              <h2>
                Job Description
              </h2>

              <p>
                {job.description}
              </p>

            </section>


            <section className="details-section">

              <h2>
                Requirements
              </h2>

              {job.requirements ? (
                <div className="requirements-text">
                  {job.requirements}
                </div>
              ) : (
                <p>
                  No specific requirements were provided
                  by the employer.
                </p>
              )}

            </section>


            <section className="details-section">

              <h2>
                About this opportunity
              </h2>

              <p>
                This position is currently available on
                JobSpot. Review the job information carefully
                before submitting your application.
              </p>

            </section>

          </div>


          {/* Right */}

          <aside className="job-details-sidebar">

            <div className="apply-card">

              <h3>
                Interested in this job?
              </h3>

              <p>
                Take the next step and submit your
                application to the employer.
              </p>

              <button
                className="apply-button"
                onClick={() =>
                  navigate(`/jobs/${job.id}/apply`)
                }
              >
                Apply Now →
              </button>

              <button
                className="save-details-button"
              >
                ♡ Save Job
              </button>

            </div>


            <div className="job-info-card">

              <h3>
                Job Information
              </h3>

              {(job.salary_min || job.salary_max) && (
                <div className="info-row">

                  <span>
                    Salary
                  </span>

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

                <span>
                  Job Type
                </span>

                <strong>
                  {job.job_type}
                </strong>

              </div>

              <div className="info-row">

                <span>
                  Location
                </span>

                <strong>
                  {job.location || "Remote"}
                </strong>

              </div>

              <div className="info-row">

                <span>
                  Category
                </span>

                <strong>
                  {job.category || "General"}
                </strong>

              </div>

              {job.deadline && (
                <div className="info-row">

                  <span>
                    Application Deadline
                  </span>

                  <strong>
                    {new Date(
                      job.deadline
                    ).toLocaleDateString()}
                  </strong>

                </div>
              )}

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default JobDetails;