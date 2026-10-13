import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Applications.css";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get(
        "/applications/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(
        response.data.applications || []
      );
    } catch (error) {
      console.error(
        "Applications error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
  switch (status) {
    case "Reviewed":
      return "status-reviewed";

    case "Shortlisted":
      return "status-shortlisted";

    case "Rejected":
      return "status-rejected";

    default:
      return "status-pending";
  }
};

  return (
    <div className="applications-page">

      <header className="applications-header">

        <div
          className="jobs-logo"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <div className="jobs-logo-icon">
            J
          </div>

          <span>JobSpot</span>
        </div>

        <nav className="applications-nav">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/find-jobs")
            }
          >
            Find Jobs
          </button>

          <button className="applications-nav-active">
            Applications
          </button>

        </nav>

        <button
          className="details-dashboard-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          My Dashboard
        </button>

      </header>


      <main className="applications-container">

        <div className="applications-heading">

          <div>
            <p>JOB SEEKER</p>

            <h1>My Applications</h1>

            <span>
              Track the jobs you have applied for
              and monitor your application status.
            </span>
          </div>

          <button
            className="browse-applications-button"
            onClick={() =>
              navigate("/find-jobs")
            }
          >
            Find More Jobs →
          </button>

        </div>


        {loading && (
          <div className="applications-message">

            <div className="loading-spinner"></div>

            <p>
              Loading your applications...
            </p>

          </div>
        )}


        {!loading && error && (
          <div className="applications-error">
            {error}
          </div>
        )}


        {!loading &&
          !error &&
          applications.length === 0 && (

            <div className="applications-empty">

              <div className="applications-empty-icon">
                📋
              </div>

              <h2>
                No applications yet
              </h2>

              <p>
                You haven't applied for any jobs yet.
                Start exploring opportunities on JobSpot.
              </p>

              <button
                onClick={() =>
                  navigate("/find-jobs")
                }
              >
                Browse Jobs →
              </button>

            </div>
          )}


        {!loading &&
          !error &&
          applications.length > 0 && (

            <div className="applications-list">

              <div className="applications-list-top">

                <h2>
                  Your Applications
                </h2>

                <span>
                  {applications.length}{" "}
                  {applications.length === 1
                    ? "Application"
                    : "Applications"}
                </span>

              </div>


              {applications.map(
                (application) => (

                  <article
                    className="application-card"
                    key={application.id}
                  >

                    <div className="application-company-icon">
                      {application.company_name
                        ?.charAt(0)
                        .toUpperCase() || "C"}
                    </div>


                    <div className="application-card-content">

                      <div className="application-card-main">

                        <div>

                          <h3>
                            {application.title}
                          </h3>

                          <p className="application-company-name">
                            {application.company_name}
                          </p>

                        </div>


                        <span
                          className={`application-status ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>

                      </div>


                      <div className="application-card-details">

                        <span>
                          📍{" "}
                          {application.location ||
                            "Remote"}
                        </span>

                        <span>
                          💼{" "}
                          {application.job_type}
                        </span>

                        <span>
                          ◆{" "}
                          {application.category ||
                            "General"}
                        </span>

                      </div>


                      <div className="application-card-footer">

                        <span>
                          Applied on{" "}
                          {new Date(
                            application.applied_at
                          ).toLocaleDateString()}
                        </span>

                        <span>
                          Resume submitted
                        </span>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>
          )}

      </main>

    </div>
  );
}

export default Applications;