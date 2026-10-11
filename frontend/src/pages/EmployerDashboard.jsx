
import { useNavigate } from "react-router-dom";

function EmployerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="employer-dashboard-page">
      <header className="employer-dashboard-header">
        <div
          className="jobs-logo"
          onClick={() => navigate("/dashboard")}
        >
          <div className="jobs-logo-icon">J</div>
          <span>JobSpot</span>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>

      <main className="employer-dashboard-container">
        <p className="employer-eyebrow">
          EMPLOYER WORKSPACE
        </p>

        <h1>Welcome to your employer dashboard</h1>

        <p className="employer-dashboard-subtitle">
          Manage your company profile, publish opportunities,
          and connect with potential candidates.
        </p>

        <div className="employer-action-grid">
          <article className="employer-action-card">
            <div className="employer-action-icon">🏢</div>
            <h2>Company Profile</h2>
            <p>
              Create and manage your company information
              so candidates can learn about your business.
            </p>
            <button
              onClick={() => navigate("/employer/company")}
            >
              Manage Company →
            </button>
          </article>

          <article className="employer-action-card">
            <div className="employer-action-icon">💼</div>
            <h2>Post a Job</h2>
            <p>
              Publish a new opportunity with its
              requirements, location, salary and deadline.
            </p>
            <button
              onClick={() => navigate("/employer/post-job")}
            >
              Create Job Posting →
            </button>
          </article>

          <article className="employer-action-card">
            <div className="employer-action-icon">📋</div>
            <h2>Manage Applications</h2>
            <p>
              Review candidate applications and manage
              their recruitment progress.
            </p>
            <button
              onClick={() => navigate("/employer/applications")}
            >
              View Applications →
            </button>
          </article>

          <article className="employer-action-card">
            <div className="employer-action-icon">🔎</div>
            <h2>Explore Job Listings</h2>
            <p>
              Review published jobs and check how
              opportunities appear to job seekers.
            </p>
            <button
              onClick={() => navigate("/find-jobs")}
            >
              Browse Jobs →
            </button>
          </article>
        </div>
      </main>
      
<article className="employer-action-card">
  <div className="employer-action-icon">🛠️</div>
  <h2>Manage Jobs</h2>
  <p>
    View your job postings, update job details,
    and remove opportunities that are no longer available.
  </p>
  <button onClick={() => navigate("/employer/jobs")}>
    Manage Job Listings →
  </button>
</article>

    </div>
  );
}

export default EmployerDashboard;