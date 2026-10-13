import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "./EmployerDashboard.css";

function EmployerDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get("/jobs/employer-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(response.data.stats);
      } catch (error) {
        setStatsError(
          error.response?.data?.message ||
            "Statistics could not be loaded."
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const statCards = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      description: "All your job postings",
      icon: "▤",
      color: "violet",
    },
    {
      label: "Active Jobs",
      value: stats.activeJobs,
      description: "Within application deadline",
      icon: "✓",
      color: "coral",
    },
    {
      label: "Applications",
      value: stats.totalApplications,
      description: "Applications received",
      icon: "♧",
      color: "blue",
    },
    {
      label: "Shortlisted",
      value: stats.shortlistedCandidates,
      description: "Selected for further review",
      icon: "★",
      color: "amber",
    },
  ];

  const actions = [
    {
      number: "01",
      icon: "▦",
      title: "Company Profile",
      description:
        "Build your company's identity and help candidates understand your business.",
      button: "Manage Company",
      path: "/employer/company",
    },
    {
      number: "02",
      icon: "＋",
      title: "Post a Job",
      description:
        "Publish a new opportunity with requirements, location, salary and deadline.",
      button: "Create Job Posting",
      path: "/employer/post-job",
    },
    {
      number: "03",
      icon: "◎",
      title: "Manage Applications",
      description:
        "Review candidate applications and move promising applicants through recruitment.",
      button: "View Applications",
      path: "/employer/applications",
    },
    {
      number: "04",
      icon: "⌕",
      title: "Explore Job Listings",
      description:
        "See published opportunities and understand how jobs appear to candidates.",
      button: "Browse Jobs",
      path: "/find-jobs",
    },
    {
      number: "05",
      icon: "▥",
      title: "Manage Jobs",
      description:
        "Update job details, review your listings and remove opportunities when needed.",
      button: "Manage Job Listings",
      path: "/employer/jobs",
    },
  ];

  return (
    <div className="employer-dashboard-page">
      <header className="employer-dashboard-header">
        <button
          className="jobs-logo"
          onClick={() => navigate("/employer")}
          aria-label="Go to employer dashboard"
        >
          <span className="jobs-logo-icon">J</span>
          <span>JobSpot<span className="logo-period">.</span></span>
          <span className="employer-logo-label">FOR EMPLOYERS</span>
        </button>

        <button
          className="employer-logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <span aria-hidden="true">↗</span> Logout
        </button>
      </header>

      <main className="employer-dashboard-container">
        <section className="employer-welcome">
          <div className="employer-welcome-copy">
            <p className="employer-eyebrow">
              <span className="eyebrow-line" />
              EMPLOYER WORKSPACE
            </p>

            <h1>
              Find your next
              <br />
              <span>great hire.</span>
            </h1>

            <p className="employer-dashboard-subtitle">
              Manage your company, publish opportunities, and connect
              with people who can move your business forward.
            </p>

            <div className="employer-welcome-actions">
              <button
                className="employer-primary-button"
                onClick={() => navigate("/employer/post-job")}
              >
                + Post a new job
              </button>

              <button
                className="employer-secondary-button"
                onClick={() => navigate("/employer/applications")}
              >
                Review candidates <span>→</span>
              </button>
            </div>
          </div>

          <div className="employer-welcome-art" aria-hidden="true">
            <div className="welcome-orbit orbit-one" />
            <div className="welcome-orbit orbit-two" />

            <div className="welcome-art-card">
              <div className="welcome-art-top">
                <span className="welcome-art-symbol">J.</span>
                <span className="welcome-art-status">
                  <span /> YOUR NEXT CHAPTER
                </span>
              </div>

              <div className="welcome-art-title">
                Great teams
                <br />
                start with
                <br />
                <span>great people.</span>
              </div>

              <div className="welcome-art-bottom">
                <span className="avatar-stack">
                  <i>A</i><i>M</i><i>S</i>
                </span>
                <span>Talent meets opportunity.</span>
              </div>
            </div>

            <span className="welcome-floating-star">✳</span>
            <span className="welcome-floating-plus">+</span>
          </div>
        </section>

        <section className="employer-stats-section">
          <div className="employer-stats-heading">
            <div>
              <p className="section-kicker">YOUR NUMBERS</p>
              <h2>Hiring overview<span>.</span></h2>
              <p className="section-description">
                Your recruitment activity at a glance.
              </p>
            </div>

            <span className="employer-live-label">
              <span className="employer-live-dot" />
              Live overview
            </span>
          </div>

          {statsError && (
            <div className="employer-stats-error" role="alert">
              <span>!</span>
              {statsError}
              <button
                onClick={() => window.location.reload()}
                aria-label="Retry loading statistics"
              >
                Retry
              </button>
            </div>
          )}

          <div className="employer-stats-grid">
            {statCards.map((stat) => (
              <article
                className={`employer-stat-card stat-${stat.color}`}
                key={stat.label}
              >
                <div className="employer-stat-top">
                  <span className="employer-stat-icon">{stat.icon}</span>
                  <span className="employer-stat-label">{stat.label}</span>
                  <span className="stat-card-arrow" aria-hidden="true">↗</span>
                </div>

                <strong className="employer-stat-value">
                  {statsLoading ? (
                    <span className="stat-loading">—</span>
                  ) : (
                    stat.value ?? 0
                  )}
                </strong>

                <p>{stat.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="employer-actions-section">
          <div className="employer-actions-heading">
            <div>
              <p className="section-kicker">GET THINGS DONE</p>
              <h2>Your workspace<span>.</span></h2>
            </div>

            <span className="workspace-count">
              05 <span>TOOLS</span>
            </span>
          </div>

          <div className="employer-action-grid">
            {actions.map((action) => (
              <article className="employer-action-card" key={action.number}>
                <div className="action-card-top">
                  <span className="employer-action-icon">
                    {action.icon}
                  </span>
                  <span className="action-card-number">
                    {action.number}
                  </span>
                </div>

                <h3>{action.title}</h3>
                <p>{action.description}</p>

                <button
                  className="employer-action-link"
                  onClick={() => navigate(action.path)}
                >
                  {action.button}
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <footer className="employer-dashboard-footer">
          <span className="footer-brand">JobSpot<span>.</span></span>
          <span>Better hiring starts here.</span>
        </footer>
      </main>
    </div>
  );
}

export default EmployerDashboard;