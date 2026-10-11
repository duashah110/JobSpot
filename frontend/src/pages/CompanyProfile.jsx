
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CompanyProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    description: "",
    website: "",
    location: "",
    logo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isExisting, setIsExisting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get("/companies/my-company", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const company = response.data.company;

        setFormData({
          company_name: company.company_name || "",
          description: company.description || "",
          website: company.website || "",
          location: company.location || "",
          logo: company.logo || "",
        });

        setIsExisting(true);
      } catch (error) {
        if (error.response?.status === 404) {
          setIsExisting(false);
        } else {
          setMessage(
            error.response?.data?.message ||
              "Could not load company profile."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCompany();
    } else {
      setMessage("Please log in first.");
      setLoading(false);
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      if (isExisting) {
  await api.put("/companies", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setMessage("Company profile updated successfully!");
} else {
  await api.post("/companies", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setIsExisting(true);
  setMessage("Company profile created successfully!");
}

      setIsExisting(true);
      setMessage("Company profile saved successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to save company profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="company-loading">Loading company profile...</div>;
  }

  return (
    <div className="company-profile-page">
      <header className="company-profile-header">
        <button
          type="button"
          className="company-back-button"
          onClick={() => navigate("/employer")}
        >
          ← Employer Dashboard
        </button>

        <span className="company-brand">JobSpot</span>
      </header>

      <main className="company-profile-container">
        <p className="company-eyebrow">EMPLOYER WORKSPACE</p>
        <h1>{isExisting ? "Your Company Profile" : "Create Company Profile"}</h1>
        <p className="company-intro">
          Share your company information with candidates and build trust
          with potential applicants.
        </p>

        <form className="company-profile-form" onSubmit={handleSubmit}>
          <label htmlFor="company_name">Company Name *</label>
          <input
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="e.g. TechNova Solutions"
            required
          />

          <label htmlFor="description">Company Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell candidates about your company..."
            rows={5}
          />

          <label htmlFor="website">Company Website</label>
          <input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />

          <label htmlFor="location">Company Location</label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Karachi, Pakistan"
          />

          <label htmlFor="logo">Company Logo URL (optional)</label>
          <input
            id="logo"
            name="logo"
            type="url"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />

          {message && (
            <p
              className={
                message.includes("successfully")
                  ? "company-message success"
                  : "company-message error"
              }
            >
              {message}
            </p>
          )}

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : isExisting
              ? "Save Company Profile"
              : "Create Company Profile"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CompanyProfile;