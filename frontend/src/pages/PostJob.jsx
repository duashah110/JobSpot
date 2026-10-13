import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./PostJob.css";

function getLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const initialFormData = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  job_type: "Full-Time",
  category: "",
  salary_min: "",
  salary_max: "",
  deadline: "",
};

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ ...initialFormData });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const minSalary =
      formData.salary_min === "" ? null : Number(formData.salary_min);

    const maxSalary =
      formData.salary_max === "" ? null : Number(formData.salary_max);

    if (
      (minSalary !== null && (!Number.isFinite(minSalary) || minSalary < 0)) ||
      (maxSalary !== null && (!Number.isFinite(maxSalary) || maxSalary < 0))
    ) {
      setMessage("Salary cannot be negative or invalid.");
      return;
    }

    if (
      minSalary !== null &&
      maxSalary !== null &&
      minSalary > maxSalary
    ) {
      setMessage("Minimum salary cannot exceed maximum salary.");
      return;
    }

    if (formData.deadline && formData.deadline < getLocalDate()) {
      setMessage("Application deadline cannot be in the past.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Your session has expired. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      await api.post(
        "/jobs",
        {
          ...formData,
          salary_min: minSalary,
          salary_max: maxSalary,
          deadline: formData.deadline || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Job posted successfully!");
      setFormData({ ...initialFormData });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to post job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="post-job-page">
      <header className="post-job-header">
        <button
          className="post-job-back"
          type="button"
          onClick={() => navigate("/employer")}
        >
          <span aria-hidden="true">←</span>
          Employer Dashboard
        </button>

        <button
          className="post-job-logo"
          type="button"
          onClick={() => navigate("/employer")}
          aria-label="JobSpot home"
        >
          Job<span>Spot</span>
          <i aria-hidden="true">.</i>
        </button>

        <div className="post-job-header-label">EMPLOYER WORKSPACE</div>
      </header>

      <main className="post-job-container">
        <section className="post-job-hero">
          <div className="post-job-hero-content">
            <p className="post-job-eyebrow">
              <span className="post-job-eyebrow-dot" />
              EMPLOYER WORKSPACE
            </p>

            <h1>
              Find your next
              <br />
              <span>great teammate.</span>
            </h1>

            <p className="post-job-intro">
              Create a job listing that stands out. Share the details,
              reach qualified candidates, and grow your team.
            </p>

            <div className="post-job-hero-points">
              <span>✦ Reach candidates</span>
              <span>✦ Manage applications</span>
            </div>
          </div>

          <div className="post-job-hero-art" aria-hidden="true">
            <div className="post-job-art-orbit">
              <div className="post-job-art-card">
                <span className="post-job-art-icon">✳</span>
                <span className="post-job-art-line post-job-art-line-long" />
                <span className="post-job-art-line" />
                <div className="post-job-art-tags">
                  <span>Talent</span>
                  <span>Growth</span>
                </div>
              </div>
              <span className="post-job-art-spark spark-one">✦</span>
              <span className="post-job-art-spark spark-two">✳</span>
              <span className="post-job-art-circle" />
            </div>
          </div>
        </section>

        <section className="post-job-form-section">
          <div className="post-job-form-heading">
            <div>
              <p className="post-job-section-kicker">LET'S GET STARTED</p>
              <h2>Job details</h2>
              <p className="post-job-form-subtitle">
                Add the information candidates need to apply with confidence.
              </p>
            </div>

            <div className="post-job-required-note">
              <span>*</span> Required fields
            </div>
          </div>

          <form className="post-job-form" onSubmit={handleSubmit}>
            <div className="post-job-field">
              <label htmlFor="title">
                Job title <span>*</span>
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                autoComplete="off"
                maxLength={150}
                required
              />
              <small>A clear title helps the right people find your job.</small>
            </div>

            <div className="post-job-field">
              <label htmlFor="description">
                Job description <span>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what success looks like..."
                rows={5}
                required
              />
            </div>

            <div className="post-job-field">
              <label htmlFor="requirements">Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Skills, qualifications, experience, and other expectations..."
                rows={4}
              />
            </div>

            <div className="post-job-field-grid">
              <div className="post-job-field">
                <label htmlFor="category">Job category</label>
                <input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Software Development"
                />
              </div>

              <div className="post-job-field">
                <label htmlFor="job_type">
                  Employment type <span>*</span>
                </label>
                <select
                  id="job_type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="post-job-field">
              <label htmlFor="location">Job location</label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Karachi, Pakistan or Remote"
              />
            </div>

            <div className="post-job-divider" />

            <div className="post-job-subsection-heading">
              <div className="post-job-subsection-icon">₨</div>
              <div>
                <h3>Compensation & timeline</h3>
                <p>Help candidates understand the salary range and deadline.</p>
              </div>
            </div>

            <div className="post-job-field-grid">
              <div className="post-job-field">
                <label htmlFor="salary_min">Minimum salary (PKR)</label>
                <input
                  id="salary_min"
                  name="salary_min"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.salary_min}
                  onChange={handleChange}
                  placeholder="e.g. 60000"
                />
              </div>

              <div className="post-job-field">
                <label htmlFor="salary_max">Maximum salary (PKR)</label>
                <input
                  id="salary_max"
                  name="salary_max"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.salary_max}
                  onChange={handleChange}
                  placeholder="e.g. 100000"
                />
              </div>
            </div>

            <div className="post-job-field">
              <label htmlFor="deadline">Application deadline</label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                min={getLocalDate()}
                value={formData.deadline}
                onChange={handleChange}
              />
              <small>Leave empty if no deadline has been set.</small>
            </div>

            {message && (
              <div
                className={`post-job-message ${
                  message === "Job posted successfully!" ? "success" : "error"
                }`}
                role="status"
                aria-live="polite"
              >
                <span aria-hidden="true">
                  {message === "Job posted successfully!" ? "✓" : "!"}
                </span>
                {message}
              </div>
            )}

            <div className="post-job-form-footer">
              <p>
                <span>*</span> Please review the details before publishing.
              </p>

              <button
                className="post-job-submit"
                type="submit"
                disabled={saving}
              >
                {saving ? "Publishing..." : "Publish job"}
                {!saving && <span aria-hidden="true">↗</span>}
              </button>
            </div>
          </form>
        </section>

        <footer className="post-job-footer">
          <button type="button" onClick={() => navigate("/employer")}>
            ← Back to dashboard
          </button>
          <span>Build your team with JobSpot.</span>
        </footer>
      </main>
    </div>
  );
}

export default PostJob;