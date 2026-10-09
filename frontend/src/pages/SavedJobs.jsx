
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SavedJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/saved-jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Saved jobs error:", error);
      setError(
        error.response?.data?.message ||
          "Unable to load saved jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeJob = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      setRemovingId(jobId);
      setError("");

      await api.delete(`/saved-jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job.job_id !== jobId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to remove saved job."
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="saved-jobs-page">
      <header className="saved-jobs-header">
        <div
          className="jobs-logo"
          onClick={() => navigate("/dashboard")}
        >
          <div className="jobs-logo-icon">J</div>
          <span>JobSpot</span>
        </div>

        <nav className="saved-jobs-nav">
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/find-jobs")}>
            Find Jobs
          </button>

          <button
            className="saved-jobs-nav-active"
          >
            Saved Jobs
          </button>

          <button onClick={() => navigate("/applications")}>
            Applications
          </button>
        </nav>

        <button
          className="details-dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          My Dashboard
        </button>
      </header>

      <main className="saved-jobs-container">
        <div className="saved-jobs-heading">
          <div>
            <p className="saved-jobs-eyebrow">
              YOUR CAREER COLLECTION
            </p>

            <h1>Saved Jobs</h1>

            <p>
              Keep track of opportunities you want
              to explore or apply for later.
            </p>
          </div>

          <button
            className="browse-applications-button"
            onClick={() => navigate("/find-jobs")}
          >
            Explore Jobs →
          </button>
        </div>

        <div className="saved-jobs-count">
          <span>Bookmarked opportunities</span>
          <strong>
            {jobs.length}{" "}
            {jobs.length === 1 ? "job" : "jobs"}
          </strong>
        </div>

        {loading && (
          <div className="saved-jobs-message">
            <div className="loading-spinner"></div>
            <p>Loading your saved jobs...</p>
          </div>
        )}

        {!loading && error && (
          <div className="saved-jobs-error">
            {error}
            <button onClick={loadSavedJobs}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="saved-jobs-empty">
            <div className="saved-jobs-empty-icon">♡</div>

            <h2>No saved jobs yet</h2>

            <p>
              Found an interesting opportunity?
              Save it from the Find Jobs page and
              it will appear here.
            </p>

            <button onClick={() => navigate("/find-jobs")}>
              Browse Available Jobs →
            </button>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="saved-jobs-list">
            {jobs.map((job) => (
              <article
                className="saved-job-card"
                key={job.saved_id}
              >
                <div className="saved-job-company-icon">
                  {job.company_name
                    ?.charAt(0)
                    .toUpperCase() || "C"}
                </div>

                <div className="saved-job-content">
                  <div className="saved-job-top">
                    <div>
                      <h2>{job.title}</h2>
                      <p className="saved-job-company">
                        {job.company_name}
                      </p>
                    </div>

                    <button
                      className="saved-job-remove"
                      onClick={() => removeJob(job.job_id)}
                      disabled={removingId === job.job_id}
                    >
                      {removingId === job.job_id
                        ? "Removing..."
                        : "♥ Remove"}
                    </button>
                  </div>

                  <div className="saved-job-meta">
                    <span>
                      📍 {job.location || "Remote"}
                    </span>

                    <span>💼 {job.job_type}</span>

                    <span>
                      ◆ {job.category || "General"}
                    </span>
                  </div>

                  {(job.salary_min || job.salary_max) && (
                    <p className="saved-job-salary">
                      Rs.{" "}
                      {job.salary_min
                        ? Number(job.salary_min).toLocaleString()
                        : "Negotiable"}
                      {" – "}
                      {job.salary_max
                        ? `Rs. ${Number(
                            job.salary_max
                          ).toLocaleString()}`
                        : "Negotiable"}
                    </p>
                  )}

                  <p className="saved-job-description">
                    {job.description}
                  </p>

                  <div className="saved-job-footer">
                    <span>
                      Saved on{" "}
                      {new Date(
                        job.saved_at
                      ).toLocaleDateString()}
                    </span>

                    <button
                      className="saved-job-view"
                      onClick={() =>
                        navigate(`/jobs/${job.job_id}`)
                      }
                    >
                      View Job →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SavedJobs;