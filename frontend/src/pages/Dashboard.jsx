
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect } from "react";
import "../App.css";

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
      navigate("/login");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    api.get("/applications/my-applications", { headers })
      .then((res) => {
        const apps = res.data.applications || [];
        setApplicationsCount(apps.length);
        setShortlistedCount(
          apps.filter((app) => app.status === "Shortlisted").length
        );
      })
      .catch((err) => console.error("Applications count:", err));

    api.get("/saved-jobs", { headers })
      .then((res) => {
        const jobs = res.data.savedJobs || res.data.jobs || [];
        setSavedCount(jobs.length);
      })
      .catch((err) => console.error("Saved jobs count:", err));
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
    navigate(routes[name]);
  };

  const searchJobs = (e) => {
    e.preventDefault();
    navigate("/find-jobs", {
      state: { keyword: keyword.trim(), location: location.trim() },
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
        <div className="sidebar-logo" onClick={() => goTo("Dashboard")}>
          <div className="logo-icon">J</div>
          <span>JobSpot</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`sidebar-item ${
                activeMenu === item.name ? "active" : ""
              }`}
              onClick={() => goTo(item.name)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-button" onClick={logout}>
            <span>↪</span> Logout
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
            className="header-profile"
            onClick={() => goTo("Profile")}
            title="Open your profile"
          >
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <strong>{user?.name || "Job Seeker"}</strong>
              <span>{user?.email || ""}</span>
            </div>
          </button>
        </header>

        <section className="welcome-section">
          <div>
            <p className="welcome-small">Welcome back 👋</p>
            <h1>
              Find your next <span>opportunity.</span>
            </h1>
            <p className="welcome-text">
              Discover jobs that match your skills, experience and career goals.
            </p>
          </div>
          <div className="welcome-decoration">💼</div>
        </section>

        <form className="job-search" onSubmit={searchJobs}>
          <div className="search-field">
            <span>⌕</span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search job title, skills or keywords"
            />
          </div>

          <div className="search-field location-field">
            <span>⌖</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
            />
          </div>

          <button className="search-button" type="submit">
            Search Jobs
          </button>
        </form>

        <section className="stats-grid">
          <button className="stat-card" onClick={() => goTo("Applications")}>
            <div className="stat-icon blue">▣</div>
            <div>
              <p>Applications</p>
              <h3>{applicationsCount}</h3>
              <span>Jobs applied</span>
            </div>
          </button>

          <button className="stat-card" onClick={() => goTo("Saved Jobs")}>
            <div className="stat-icon purple">♡</div>
            <div>
              <p>Saved Jobs</p>
              <h3>{savedCount}</h3>
              <span>Jobs saved</span>
            </div>
          </button>

          <button className="stat-card" onClick={() => goTo("Applications")}>
            <div className="stat-icon green">✓</div>
            <div>
              <p>Shortlisted</p>
              <h3>{shortlistedCount}</h3>
              <span>Applications</span>
            </div>
          </button>

          <button className="stat-card" onClick={() => goTo("Profile")}>
            <div className="stat-icon orange">★</div>
            <div>
              <p>Profile</p>
              <h3>View</h3>
              <span>Manage your details</span>
            </div>
          </button>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <h2>Recommended Jobs</h2>
              <p>Explore opportunities for your next career move</p>
            </div>
            <button className="view-all" onClick={() => goTo("Find Jobs")}>
              View all →
            </button>
          </div>

          <div className="empty-jobs">
            <div className="empty-icon">🔎</div>
            <h3>Explore available jobs</h3>
            <p>
              Browse current openings and find opportunities that match your
              skills and interests.
            </p>
            <button className="browse-button" onClick={() => goTo("Find Jobs")}>
              Browse Jobs
            </button>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-card-icon">👤</div>
          <div className="profile-card-content">
            <h3>Keep your profile up to date</h3>
            <p>
              Add your skills, experience and education to help employers learn
              more about you.
            </p>
          </div>
          <button className="profile-button" onClick={() => goTo("Profile")}>
            My Profile →
          </button>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
