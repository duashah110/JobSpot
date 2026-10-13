
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my-applications", {
          headers,
        });

        const apps = Array.isArray(res.data.applications)
          ? res.data.applications
          : [];

        setApplicationsCount(apps.length);

        setShortlistedCount(
          apps.filter(
            (app) =>
              String(app.status || "").toLowerCase() === "shortlisted"
          ).length
        );
      } catch (err) {
        console.error("Applications count:", err);
      }
    };

    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/saved-jobs", { headers });

        const jobs = Array.isArray(res.data.savedJobs)
          ? res.data.savedJobs
          : Array.isArray(res.data.jobs)
            ? res.data.jobs
            : [];

        setSavedCount(jobs.length);
      } catch (err) {
        console.error("Saved jobs count:", err);
      }
    };

    fetchApplications();
    fetchSavedJobs();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const goTo = (name) => {
    setActiveMenu(name);

    const routes = {
      Dashboard: "/dashboard",
      "Find Jobs": "/find-jobs",
      "Saved Jobs": "/saved-jobs",
      Applications: "/applications",
      Profile: "/profile",
    };

    if (routes[name]) {
      navigate(routes[name]);
    }
  };

  const searchJobs = (e) => {
    e.preventDefault();

    navigate("/find-jobs", {
      state: {
        keyword: keyword.trim(),
        location: location.trim(),
      },
    });
  };

  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Find Jobs", icon: "⌕" },
    { name: "Saved Jobs", icon: "♡" },
    { name: "Applications", icon: "▣" },
    { name: "Profile", icon: "◯" },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <button
          type="button"
          className="sidebar-logo"
          onClick={() => goTo("Dashboard")}
          aria-label="Go to JobSpot dashboard"
        >
          <span className="logo-icon">J</span>
          <span>
            JobSpot<span className="logo-period">.</span>
          </span>
        </button>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`sidebar-item ${
                activeMenu === item.name ? "active" : ""
              }`}
              onClick={() => goTo(item.name)}
              aria-current={activeMenu === item.name ? "page" : undefined}
            >
              <span className="sidebar-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            <span aria-hidden="true">↪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="header-label">JOB SEEKER</p>
            <h2>Dashboard</h2>
          </div>

          <button
            type="button"
            className="header-profile"
            onClick={() => goTo("Profile")}
            title="Open your profile"
          >
            <span className="avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>

            <span className="header-profile-info">
              <strong>{user?.name || "Job Seeker"}</strong>
              <span>{user?.email || ""}</span>
            </span>
          </button>
        </header>

        <section className="welcome-section">
          <div>
            <p className="welcome-small">Welcome back 👋</p>

            <h1>
              Find your next <span>opportunity.</span>
            </h1>

            <p className="welcome-text">
              Discover jobs that match your skills, experience and career
              goals.
            </p>
          </div>

          <div className="welcome-decoration" aria-hidden="true">
            💼
          </div>
        </section>

        <form className="job-search" onSubmit={searchJobs}>
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search job title, skills or keywords"
              aria-label="Job title, skills or keywords"
            />
          </label>

          <label className="search-field location-field">
            <span aria-hidden="true">⌖</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              aria-label="Job location"
            />
          </label>

          <button className="search-button" type="submit">
            Search Jobs <span aria-hidden="true">→</span>
          </button>
        </form>

        <section className="stats-grid" aria-label="Your job search statistics">
          <button
            type="button"
            className="stat-card"
            onClick={() => goTo("Applications")}
          >
            <span className="stat-icon blue">▣</span>
            <span className="stat-content">
              <span className="stat-label">Applications</span>
              <strong className="stat-value">{applicationsCount}</strong>
              <span className="stat-description">Jobs applied</span>
            </span>
            <span className="stat-arrow" aria-hidden="true">↗</span>
          </button>

          <button
            type="button"
            className="stat-card"
            onClick={() => goTo("Saved Jobs")}
          >
            <span className="stat-icon purple">♡</span>
            <span className="stat-content">
              <span className="stat-label">Saved Jobs</span>
              <strong className="stat-value">{savedCount}</strong>
              <span className="stat-description">Jobs saved</span>
            </span>
            <span className="stat-arrow" aria-hidden="true">↗</span>
          </button>

          <button
            type="button"
            className="stat-card"
            onClick={() => goTo("Applications")}
          >
            <span className="stat-icon coral">✓</span>
            <span className="stat-content">
              <span className="stat-label">Shortlisted</span>
              <strong className="stat-value">{shortlistedCount}</strong>
              <span className="stat-description">Applications</span>
            </span>
            <span className="stat-arrow" aria-hidden="true">↗</span>
          </button>

          <button
            type="button"
            className="stat-card"
            onClick={() => goTo("Profile")}
          >
            <span className="stat-icon orange">★</span>
            <span className="stat-content">
              <span className="stat-label">Profile</span>
              <strong className="stat-value stat-view-value">View</strong>
              <span className="stat-description">Manage your details</span>
            </span>
            <span className="stat-arrow" aria-hidden="true">↗</span>
          </button>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">YOUR NEXT MOVE</p>
              <h2>Recommended Jobs<span>.</span></h2>
              <p>Explore opportunities for your next career move.</p>
            </div>

            <button
              type="button"
              className="view-all"
              onClick={() => goTo("Find Jobs")}
            >
              View all <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="empty-jobs">
            <div className="empty-icon" aria-hidden="true">
              <span>⌕</span>
            </div>

            <p className="empty-eyebrow">YOUR NEXT OPPORTUNITY</p>
            <h3>Discover your next role</h3>

            <p>
              Browse current openings and find opportunities that match your
              skills and interests.
            </p>

            <button
              type="button"
              className="browse-button"
              onClick={() => goTo("Find Jobs")}
            >
              Explore Jobs <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-card-icon" aria-hidden="true">
            ◯
          </div>

          <div className="profile-card-content">
            <p className="profile-card-label">STAND OUT TO EMPLOYERS</p>
            <h3>Keep your profile up to date</h3>

            <p>
              Add your skills, experience and education to help employers
              learn more about you.
            </p>
          </div>

          <button
            type="button"
            className="profile-button"
            onClick={() => goTo("Profile")}
          >
            My Profile <span aria-hidden="true">→</span>
          </button>
        </section>

        <footer className="dashboard-footer">
          <span className="footer-brand">
            JobSpot<span>.</span>
          </span>
          <span>Find your place. Build your future.</span>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;