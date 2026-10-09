import { useEffect, useState } from "react";
import api from "../services/api";

function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await api.get("/jobs");

      console.log("Jobs:", response.data);

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Jobs error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <h1>Find Jobs</h1>

      <p>
        Explore available opportunities on JobSpot.
      </p>

      {loading && (
        <p>Loading jobs...</p>
      )}

      {!loading && jobs.length === 0 && (
        <p>No jobs available yet.</p>
      )}

      {!loading && jobs.length > 0 && (
        <div>

          <h2>
            {jobs.length} Jobs Available
          </h2>

          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginTop: "15px",
                borderRadius: "10px"
              }}
            >

              <h2>{job.title}</h2>

              <p>
                Company: {job.company_name}
              </p>

              <p>
                Location: {job.location || "Remote"}
              </p>

              <p>
                Job Type: {job.job_type}
              </p>

              <p>
                Category: {job.category || "Not specified"}
              </p>

              <p>
                {job.description}
              </p>

              <button>
                View Job
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default FindJobs;