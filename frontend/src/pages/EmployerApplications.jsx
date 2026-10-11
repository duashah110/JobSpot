
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function EmployerApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/applications/employer", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setApplications(response.data.applications || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");

      await api.patch(
        `/applications/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications((current) =>
        current.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="employer-applications-page">
      <header className="employer-applications-header">
        <button onClick={() => navigate("/employer")}>
          ← Employer Dashboard
        </button>
        <span className="employer-applications-logo">JobSpot</span>
        <button onClick={fetchApplications}>Refresh</button>
      </header>

      <main className="employer-applications-container">
        <p className="employer-eyebrow">EMPLOYER WORKSPACE</p>
        <h1>Candidate Applications</h1>
        <p className="employer-applications-subtitle">
          Review candidates who have applied for your jobs.
        </p>

        {loading && <p>Loading applications...</p>}

        {!loading && error && (
          <div className="employer-applications-error">
            {error}
            <button onClick={fetchApplications}>Try Again</button>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="employer-applications-empty">
            <h2>No applications yet</h2>
            <p>
              Applications for your published jobs will appear here.
            </p>
            <button onClick={() => navigate("/employer/post-job")}>
              Post a Job
            </button>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="employer-applications-list">
            {applications.map((app) => (
              <article
                className="employer-application-card"
                key={app.id}
              >
                <div className="employer-application-top">
                  <div>
                    <h2>{app.candidate_name || "Candidate"}</h2>
                    <p>{app.candidate_email}</p>
                  </div>
                  <span className="employer-application-status">
                    {app.status || "Pending"}
                  </span>
                </div>

                <div className="employer-application-job">
                  <strong>{app.job_title}</strong>
                  <span>
                    Applied:{" "}
                    {app.applied_at
                      ? new Date(app.applied_at).toLocaleDateString()
                      : "Date unavailable"}
                  </span>
                </div>

                <div className="employer-application-cover">
                  <strong>Cover Letter</strong>
                  <p>
                    {app.cover_letter || "No cover letter provided."}
                  </p>
                </div>

                {app.resume && (
                  <a
                    className="employer-resume-link"
                    href={`http://localhost:5000${app.resume}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume ↗
                  </a>
                )}

                <label className="employer-status-label">
                  Update application status
                  <select
                    value={app.status || "Pending"}
                    disabled={updatingId === app.id}
                    onChange={(e) =>
                      updateStatus(app.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </label>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default EmployerApplications;
