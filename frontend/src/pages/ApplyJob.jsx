import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);

      setJob(response.data.job);
    } catch (error) {
      console.error("Job loading error:", error);

      setError("Unable to load job information.");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (e) => {
  const file = e.target.files?.[0];

  setError("");
  setMessage("");

  if (!file) {
    setResume(null);
    return;
  }

  console.log("SELECTED RESUME:", file);
  console.log("RESUME NAME:", file.name);
  console.log("RESUME SIZE:", file.size);

  const allowedExtensions = [".pdf", ".doc", ".docx"];

  const extension = file.name
    .substring(file.name.lastIndexOf("."))
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    setError("Only PDF, DOC and DOCX files are allowed.");
    setResume(null);
    e.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setError("Resume size must be 5 MB or less.");
    setResume(null);
    e.target.value = "";
    return;
  }

  setResume(file);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!resume) {
  setError("Please upload your resume.");
  return;
}

    if (!coverLetter.trim()) {
      setError("Please write a cover letter.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("job_id", id);
      formData.append("cover_letter", coverLetter);
      formData.append("resume", resume);

      await api.post(
        "/applications",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Application submitted successfully!");

      setTimeout(() => {
        navigate("/applications");
      }, 1500);
    } catch (error) {
      console.error("Application error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="apply-page-loading">
        <div className="loading-spinner"></div>

        <p>Loading application form...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="apply-page-loading">
        <h2>Job not found</h2>

        <button
          onClick={() => navigate("/find-jobs")}
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="apply-page">

      <header className="apply-header">

        <div
          className="jobs-logo"
          onClick={() => navigate("/dashboard")}
        >
          <div className="jobs-logo-icon">
            J
          </div>

          <span>JobSpot</span>
        </div>

        <button
          className="details-dashboard-button"
          onClick={() => navigate("/find-jobs")}
        >
          Browse Jobs
        </button>

      </header>


      <main className="apply-container">

        <button
          className="back-jobs-button"
          onClick={() => navigate(`/jobs/${id}`)}
        >
          ← Back to Job Details
        </button>


        <div className="apply-layout">

          <section className="application-form-card">

            <div className="application-form-heading">

              <p>JOB APPLICATION</p>

              <h1>Apply for this position</h1>

              <span>
                Complete the form below to submit
                your application.
              </span>

            </div>


            {message && (
              <div className="application-success">
                ✓ {message}
              </div>
            )}


            {error && (
              <div className="application-error">
                {error}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="application-form"
            >

              {/* RESUME */}

              <div className="form-group">

                <label>
                  Resume
                  <span className="required">*</span>
                </label>


                <div className="resume-upload-box">

                  <div className="resume-upload-icon">
                    📄
                  </div>


                  <div className="resume-upload-content">

                    <strong>
                      {resume
                        ? resume.name
                        : "Upload your resume"}
                    </strong>

                    <span>
                      {resume
                        ? `${(
                            resume.size /
                            (1024 * 1024)
                          ).toFixed(2)} MB`
                        : "PDF, DOC or DOCX • Maximum 5 MB"}
                    </span>

                  </div>


                  <label className="resume-select-button">

                    {resume
                      ? "Change"
                      : "Choose File"}

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                    />

                  </label>

                </div>


                <small>
                  Upload a recent resume that highlights
                  your skills and experience.
                </small>

              </div>


              {/* COVER LETTER */}

              <div className="form-group">

                <label>
                  Cover Letter
                  <span className="required">*</span>
                </label>

                <textarea
                  rows="10"
                  placeholder="Tell the employer why you are a good fit for this position..."
                  value={coverLetter}
                  onChange={(e) =>
                    setCoverLetter(e.target.value)
                  }
                  required
                />

                <small>
                  Introduce yourself and explain why
                  you are interested in this position.
                </small>

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="submit-application-button"
                disabled={submitting}
              >
                {submitting
                  ? "Uploading & Submitting..."
                  : "Submit Application →"}
              </button>

            </form>

          </section>


          {/* JOB SUMMARY */}

          <aside className="application-job-card">

            <p className="application-summary-label">
              APPLYING FOR
            </p>


            <div className="application-company-icon">
              {job.company_name
                ?.charAt(0)
                .toUpperCase() || "C"}
            </div>


            <h2>{job.title}</h2>


            <p className="application-company">
              {job.company_name}
            </p>


            <div className="application-job-info">

              <span>
                📍 {job.location || "Remote"}
              </span>

              <span>
                💼 {job.job_type}
              </span>

              <span>
                ◆ {job.category || "General"}
              </span>

            </div>


            {(job.salary_min || job.salary_max) && (
              <div className="application-salary">

                <span>Salary</span>

                <strong>
                  Rs.{" "}
                  {job.salary_min
                    ? Number(
                        job.salary_min
                      ).toLocaleString()
                    : "0"}

                  {" - "}

                  Rs.{" "}

                  {job.salary_max
                    ? Number(
                        job.salary_max
                      ).toLocaleString()
                    : "Negotiable"}
                </strong>

              </div>
            )}


            {job.deadline && (
              <div className="application-deadline">

                <span>
                  Application Deadline
                </span>

                <strong>
                  {new Date(
                    job.deadline
                  ).toLocaleDateString()}
                </strong>

              </div>
            )}

          </aside>

        </div>

      </main>

    </div>
  );
}

export default ApplyJob;