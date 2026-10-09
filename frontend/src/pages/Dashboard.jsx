import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
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

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
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
  onClick={() => {
    setActiveMenu(item.name);

    if (item.name === "Dashboard") {
      navigate("/dashboard");
    }

    if (item.name === "Find Jobs") {
      navigate("/find-jobs");
    }

    if (item.name === "Applications") {
      navigate("/applications");
    }
  }}
>
  <span className="sidebar-icon">
    {item.icon}
  </span>

  {item.name}
</button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-button" onClick={logout}>
            <span>↪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Top Bar */}
        <header className="dashboard-header">
          <div>
            <p className="header-label">JOB SEEKER</p>
            <h2>Dashboard</h2>
          </div>

          <div className="header-profile">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Welcome */}
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

          <div className="welcome-decoration">
            💼
          </div>
        </section>

        {/* Search */}
        <section className="job-search">
          <div className="search-field">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search job title, skills or keywords"
            />
          </div>

          <div className="search-field location-field">
            <span>⌖</span>
            <input
              type="text"
              placeholder="Location"
            />
          </div>

          <button className="search-button">
            Search Jobs
          </button>
        </section>

        {/* Stats */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon blue">▣</div>
            <div>
              <p>Applications</p>
              <h3>0</h3>
              <span>Jobs applied</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">♡</div>
            <div>
              <p>Saved Jobs</p>
              <h3>0</h3>
              <span>Jobs saved</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <p>Shortlisted</p>
              <h3>0</h3>
              <span>Applications</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">★</div>
            <div>
              <p>Profile</p>
              <h3>60%</h3>
              <span>Complete your profile</span>
            </div>
          </div>

        </section>

        {/* Jobs Section */}
        <section className="content-section">

          <div className="section-heading">
            <div>
              <h2>Recommended Jobs</h2>
              <p>Opportunities you may be interested in</p>
            </div>

            <button className="view-all">
              View all →
            </button>
          </div>

          <div className="empty-jobs">

            <div className="empty-icon">
              🔎
            </div>

            <h3>No jobs available yet</h3>

            <p>
              New opportunities will appear here once employers start
              posting jobs on JobSpot.
            </p>

            <button className="browse-button">
              Browse Jobs
            </button>

          </div>

        </section>

        {/* Profile Completion */}
        <section className="profile-card">

          <div className="profile-card-icon">
            👤
          </div>

          <div className="profile-card-content">
            <h3>Complete your profile</h3>

            <p>
              Add your skills, experience and education to improve your
              chances of getting noticed by employers.
            </p>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>

          <button className="profile-button">
            Complete Profile →
          </button>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;