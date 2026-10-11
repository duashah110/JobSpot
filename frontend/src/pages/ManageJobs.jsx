
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ManageJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/jobs/my-jobs", {
        headers: getHeaders(),
      });

      setJobs(response.data.jobs || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    fetchJobs();
  }, []);

  const startEditing = (job) => {
    setMessage("");
    setError("");

    setEditingJob({
      id: job.id,
      title: job.title || "",
      description: job.description || "",
      requirements: job.requirements || "",
      location: job.location || "",
      job_type: job.job_type || "",
      category: job.category || "",
      salary_min: job.salary_min ?? "",
      salary_max: job.salary_max ?? "",
      deadline: job.deadline
        ? String(job.deadline).slice(0, 10)
        : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setEditingJob((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await api.put(
        `/jobs/${editingJob.id}`,
        {
          title: editingJob.title.trim(),
          description: editingJob.description.trim(),
          requirements: editingJob.requirements,
          location: editingJob.location,
          job_type: editingJob.job_type,
          category: editingJob.category,
          salary_min: editingJob.salary_min,
          salary_max: editingJob.salary_max,
          deadline: editingJob.deadline || null,
        },
        { headers: getHeaders() }
      );

      setMessage(
        response.data.message || "Job updated successfully."
      );
      setEditingJob(null);
      await fetchJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (job) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await api.delete(`/jobs/${job.id}`, {
        headers: getHeaders(),
      });

      setMessage(
        response.data.message || "Job deleted successfully."
      );

      if (editingJob?.id === job.id) {
        setEditingJob(null);
      }

      await fetchJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete this job."
      );
    }
  };

  const formatSalary = (job) => {
    if (job.salary_min == null && job.salary_max == null) {
      return "Salary not specified";
    }

    const format = (value) =>
      Number(value).toLocaleString("en-PK");

    if (job.salary_min != null && job.salary_max != null) {
      return `PKR ${format(job.salary_min)} - ${format(job.salary_max)}`;
    }

    if (job.salary_min != null) {
      return `From PKR ${format(job.salary_min)}`;
    }

    return `Up to PKR ${format(job.salary_max)}`;
  };

  return (
    <div className="manage-jobs-page">
      <header className="manage-jobs-header">
        <div
          className="jobs-logo"
          onClick={() => navigate("/employer")}
          role="button"
          tabIndex={0}
        >
          <div className="jobs-logo-icon">J</div>
          <span>JobSpot</span>
        </div>

        <button
          className="manage-back-button"
          onClick={() => navigate("/employer")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="manage-jobs-container">
        <p className="manage-jobs-eyebrow">EMPLOYER WORKSPACE</p>
        <h1>Manage Job Listings</h1>
        <p className="manage-jobs-subtitle">
          Keep your job postings up to date and manage your opportunities.
        </p>

        {message && (
          <div className="manage-success" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="manage-error" role="alert">
            {error}
          </div>
        )}

        {editingJob && (
          <section className="manage-edit-panel">
            <h2>Edit Job</h2>
            <p>Update the details of your job posting below.</p>

            <form onSubmit={handleUpdate}>
              <div className="manage-form-grid">
                <label>
                  Job Title *
                  <input
                    name="title"
                    value={editingJob.title}
                    onChange={handleFieldChange}
                    required
                  />
                </label>

                <label>
                  Job Type *
                  <select
                    name="job_type"
                    value={editingJob.job_type}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select job type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </label>

                <label>
                  Location
                  <input
                    name="location"
                    value={editingJob.location}
                    onChange={handleFieldChange}
                    placeholder="e.g. Karachi, Pakistan"
                  />
                </label>

                <label>
                  Category
                  <input
                    name="category"
                    value={editingJob.category}
                    onChange={handleFieldChange}
                    placeholder="e.g. Software Development"
                  />
                </label>

                <label>
                  Minimum Salary (PKR)
                  <input
                    type="number"
                    min="0"
                    name="salary_min"
                    value={editingJob.salary_min}
                    onChange={handleFieldChange}
                  />
                </label>

                <label>
                  Maximum Salary (PKR)
                  <input
                    type="number"
                    min="0"
                    name="salary_max"
                    value={editingJob.salary_max}
                    onChange={handleFieldChange}
                  />
                </label>

                <label>
                  Application Deadline
                  <input
                    type="date"
                    name="deadline"
                    value={editingJob.deadline}
                    onChange={handleFieldChange}
                  />
                </label>

                <label className="manage-full-width">
                  Job Description *
                  <textarea
                    name="description"
                    value={editingJob.description}
                    onChange={handleFieldChange}
                    rows="5"
                    required
                  />
                </label>

                <label className="manage-full-width">
                  Requirements
                  <textarea
                    name="requirements"
                    value={editingJob.requirements}
                    onChange={handleFieldChange}
                    rows="4"
                  />
                </label>
              </div>

              <div className="manage-form-actions">
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="manage-cancel-button"
                  onClick={() => setEditingJob(null)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="manage-list-heading">
          <h2>Your Job Postings</h2>
          <button onClick={() => navigate("/employer/post-job")}>
            + Post New Job
          </button>
        </div>

        {loading ? (
          <p className="manage-loading">Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="manage-empty">
            <h3>No job postings yet</h3>
            <p>Your published jobs will appear here.</p>
            <button onClick={() => navigate("/employer/post-job")}>
              Create Your First Job
            </button>
          </div>
        ) : (
          <div className="manage-job-list">
            {jobs.map((job) => (
              <article className="manage-job-card" key={job.id}>
                <div className="manage-job-top">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="manage-company-name">
                      {job.company_name || "Your Company"}
                    </p>
                  </div>

                  <span className="manage-job-type">
                    {job.job_type}
                  </span>
                </div>

                <div className="manage-job-meta">
                  <span>📍 {job.location || "Location not specified"}</span>
                  <span>💰 {formatSalary(job)}</span>
                  <span>
                    📅 Deadline:{" "}
                    {job.deadline
                      ? String(job.deadline).slice(0, 10)
                      : "Not specified"}
                  </span>
                </div>

                <p className="manage-job-description">
                  {job.description}
                </p>

                <div className="manage-job-actions">
                  <button onClick={() => startEditing(job)}>
                    Edit Job
                  </button>

                  <button
                    className="manage-delete-button"
                    onClick={() => handleDelete(job)}
                  >
                    Delete Job
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ManageJobs;
