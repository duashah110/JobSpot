import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./FindJobs.css";

function FindJobs() {
  const navigate = useNavigate();
  
const user = JSON.parse(localStorage.getItem("user") || "null");
const isEmployer = user?.role?.toLowerCase() === "employer";
const dashboardPath = isEmployer ? "/employer" : "/dashboard";


  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All");

  useEffect(() => {
    loadJobs();
  }, []);
const loadJobs = async () => {
  try {
    setLoading(true);

    const response = await api.get("/jobs");

    console.log("JOB API RESPONSE:", response.data);

    const jobData = response.data.jobs || [];

    console.log("JOBS RECEIVED:", jobData);

    setJobs(jobData);
    setFilteredJobs(jobData);

  } catch (error) {
    console.error("Jobs error:", error);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = () => {
    const searchText = search.toLowerCase().trim();
    const locationText = location.toLowerCase().trim();

    const results = jobs.filter((job) => {
      const matchesSearch =
        !searchText ||
        job.title?.toLowerCase().includes(searchText) ||
        job.category?.toLowerCase().includes(searchText) ||
        job.company_name?.toLowerCase().includes(searchText);

      const matchesLocation =
        !locationText ||
        job.location?.toLowerCase().includes(locationText);

      const matchesType =
        jobType === "All" ||
        job.job_type === jobType;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType
      );
    });

    setFilteredJobs(results);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("All");
    setFilteredJobs(jobs);
  };

  return (
    <div className="jobs-page">

      {/* Header */}
      <header className="jobs-header">

        <div
          className="jobs-logo"
          onClick={() => 
navigate(dashboardPath)
}
        >
          <div className="jobs-logo-icon">J</div>
          <span>JobSpot</span>
        </div>

        
<nav className="jobs-nav">
  <button onClick={() => navigate(dashboardPath)}>
    Dashboard
  </button>

  <button className="jobs-nav-active">
    Find Jobs
  </button>

  {!isEmployer && (
    <>
      <button onClick={() => navigate("/saved-jobs")}>
        Saved Jobs
      </button>

      <button onClick={() => navigate("/applications")}>
        Applications
      </button>
    </>
  )}

  {isEmployer && (
    <>
      <button onClick={() => navigate("/employer/jobs")}>
        Manage Jobs
      </button>

      <button onClick={() => navigate("/employer/applications")}>
        Applications
      </button>

      <button onClick={() => navigate("/employer/company")}>
        Company Profile
      </button>
    </>
  )}
</nav>


        <button
          className="jobs-profile-button"
          onClick={() => 
navigate(dashboardPath)
}
        >
          My Dashboard
        </button>

      </header>

      {/* Hero */}
      <section className="jobs-hero">

        <div className="jobs-hero-content">

          <p className="jobs-eyebrow">
            CAREER OPPORTUNITIES
          </p>

          <h1>
            Find your next
            <span> opportunity.</span>
          </h1>

          <p>
            Discover jobs that match your skills, experience
            and career goals.
          </p>

        </div>

      </section>

      {/* Search */}
      <section className="jobs-search-wrapper">

        <div className="jobs-search">

          <div className="jobs-search-field">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Job title, skills or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

          </div>

          <div className="jobs-search-field">

            <span className="search-icon">
              📍
            </span>

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

          </div>

          <select
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
            }}
          >
            <option value="All">
              All Job Types
            </option>

            <option value="Full-Time">
              Full-Time
            </option>

            <option value="Part-Time">
              Part-Time
            </option>

            <option value="Contract">
              Contract
            </option>

            <option value="Internship">
              Internship
            </option>

            <option value="Remote">
              Remote
            </option>
          </select>

          <button
            className="jobs-search-button"
            onClick={handleSearch}
          >
            Search Jobs
          </button>

        </div>

      </section>

      {/* Results */}
      <main className="jobs-content">

        <div className="jobs-results-header">

          <div>
            <h2>
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1
                ? "Job"
                : "Jobs"}{" "}
              Available
            </h2>

            <p>
              Explore opportunities from companies hiring
              on JobSpot.
            </p>
          </div>

          {(search || location || jobType !== "All") && (
            <button
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}

        </div>

        {loading && (
          <div className="jobs-message">
            <div className="loading-spinner"></div>
            <p>Loading available jobs...</p>
          </div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <div className="jobs-empty">

            <div className="jobs-empty-icon">
              🔎
            </div>

            <h3>
              No jobs found
            </h3>

            <p>
              Try changing your search keywords,
              location or job type.
            </p>

            <button
              onClick={clearFilters}
              className="browse-all-button"
            >
              Browse All Jobs
            </button>

          </div>
        )}

        {!loading && filteredJobs.length > 0 && (
          <div className="job-list">

            {filteredJobs.map((job) => (

              <article
                className="job-card"
                key={job.id}
              >

                <div className="job-company-icon">
                  {job.company_name
                    ?.charAt(0)
                    .toUpperCase() || "C"}
                </div>

                <div className="job-card-content">

                  <div className="job-card-top">

                    <div>

                      <h3>
                        {job.title}
                      </h3>

                      <p className="job-company">
                        {job.company_name}
                      </p>

                    </div>

                    
<button
  className="save-job-button"
  title="Save Job"
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await api.post(
        "/saved-jobs",
        { job_id: job.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Job saved successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to save job."
      );
    }
  }}
>
  ♡
</button>

                  </div>

                  <div className="job-details">

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
                    <p className="job-salary">

                      Rs.{" "}
                      {job.salary_min
                        ? Number(job.salary_min).toLocaleString()
                        : "0"}

                      {" - "}

                      Rs.{" "}
                      {job.salary_max
                        ? Number(job.salary_max).toLocaleString()
                        : "Negotiable"}

                    </p>
                  )}

                  <p className="job-description">
                    {job.description}
                  </p>

                  <div className="job-card-footer">

                    <span className="job-posted">
                      Posted recently
                    </span>

                    <button
                      className="job-view-button"
                      onClick={() =>
                        navigate(`/jobs/${job.id}`)
                      }
                    >
                      View Job →
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default FindJobs;