
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("jobspotProfile") || "{}");
    return {
      name: saved.name || user.name || "",
      email: user.email || "",
      skills: saved.skills || "",
      experience: saved.experience || "",
      education: saved.education || "",
    };
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("jobspotProfile", JSON.stringify(profile));

    const updatedUser = { ...user, name: profile.name };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMessage("Profile saved successfully!");
  };

  return (
    <main className="applications-page">
      <header className="applications-header">
        <div className="jobs-logo" onClick={() => navigate("/dashboard")}>
          <div className="jobs-logo-icon">J</div>
          <span>JobSpot</span>
        </div>
        <button
          className="details-dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <section className="applications-container">
        <div className="applications-heading">
          <div>
            <p>JOB SEEKER</p>
            <h1>My Profile</h1>
            <span>Manage your personal and professional information.</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="application-card"
          style={{ display: "block", maxWidth: "760px" }}
        >
          <label className="profile-field">
            Full name
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="profile-field">
            Email address
            <input value={profile.email} readOnly />
          </label>

          <label className="profile-field">
            Skills
            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="e.g. React, JavaScript, SQL"
              rows="3"
            />
          </label>

          <label className="profile-field">
            Experience
            <textarea
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              placeholder="Describe your work experience or internships"
              rows="3"
            />
          </label>

          <label className="profile-field">
            Education
            <textarea
              name="education"
              value={profile.education}
              onChange={handleChange}
              placeholder="Your degree, institute and graduation year"
              rows="3"
            />
          </label>

          {message && (
            <p style={{ color: "#167442", fontWeight: 600 }}>{message}</p>
          )}

          <button className="browse-applications-button" type="submit">
            Save Profile
          </button>
        </form>
      </section>
    </main>
  );
}

export default Profile;
