
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    job_type: "Full-Time",
    category: "",
    salary_min: "",
    salary_max: "",
    deadline: "",
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const minSalary = Number(formData.salary_min);
    const maxSalary = Number(formData.salary_max);

    if (
      formData.salary_min !== "" &&
      formData.salary_max !== "" &&
      minSalary > maxSalary
    ) {
      setMessage("Minimum salary cannot exceed maximum salary.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/jobs",
        {
          ...formData,
          salary_min:
            formData.salary_min === ""
              ? null
              : Number(formData.salary_min),
          salary_max:
            formData.salary_max === ""
              ? null
              : Number(formData.salary_max),
          deadline: formData.deadline || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Job posted successfully!");

      setFormData({
        title: "",
        description: "",
        requirements: "",
        location: "",
        job_type: "Full-Time",
        category: "",
        salary_min: "",
        salary_max: "",
        deadline: "",
      });
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
          type="button"
          onClick={() => navigate("/employer")}
        >
          ← Employer Dashboard
        </button>
        <span>JobSpot</span>
      </header>

      <main className="post-job-container">
        <p className="post-job-eyebrow">EMPLOYER WORKSPACE</p>
        <h1>Post a New Job</h1>
        <p className="post-job-intro">
          Share your opportunity and connect with the right candidates.
        </p>

        <form className="post-job-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Job Title *</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            required
          />

          <label htmlFor="description">Job Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role and responsibilities..."
            rows={5}
            required
          />

          <label htmlFor="requirements">Requirements</label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Skills, qualifications and experience..."
            rows={4}
          />

          <label htmlFor="category">Job Category</label>
          <input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Software Development"
          />

          <label htmlFor="job_type">Employment Type *</label>
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

          <label htmlFor="location">Job Location</label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Karachi, Pakistan"
          />

          <div className="post-job-salary-grid">
            <div>
              <label htmlFor="salary_min">Minimum Salary (PKR)</label>
              <input
                id="salary_min"
                name="salary_min"
                type="number"
                min="0"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="60000"
              />
            </div>

            <div>
              <label htmlFor="salary_max">Maximum Salary (PKR)</label>
              <input
                id="salary_max"
                name="salary_max"
                type="number"
                min="0"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="100000"
              />
            </div>
          </div>

          <label htmlFor="deadline">Application Deadline</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            min={new Date().toLocaleDateString("en-CA")}
            value={formData.deadline}
            onChange={handleChange}
          />

          {message && (
            <p
              className={
                message.includes("successfully")
                  ? "post-job-message success"
                  : "post-job-message error"
              }
            >
              {message}
            </p>
          )}

          <button type="submit" disabled={saving}>
            {saving ? "Publishing..." : "Publish Job"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default PostJob;
