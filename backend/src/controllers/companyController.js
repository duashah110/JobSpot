
const {
  getCompanyByUserId,
  createCompany,
  updateCompany,
} = require("../models/companyModel");
const getMyCompany = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found"
      });
    }

    res.json({
      success: true,
      company
    });
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({
      message: "Failed to fetch company"
    });
  }
};

const addCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      company_name,
      description,
      website,
      location,
      logo
    } = req.body;

    if (!company_name) {
      return res.status(400).json({
        message: "Company name is required"
      });
    }

    const existingCompany = await getCompanyByUserId(userId);

    if (existingCompany) {
      return res.status(409).json({
        message: "You already have a company profile"
      });
    }

    const result = await createCompany(
      userId,
      company_name,
      description || null,
      website || null,
      location || null,
      logo || null
    );

    res.status(201).json({
      message: "Company created successfully",
      companyId: result.insertId
    });
  } catch (error) {
    console.error("Create company error:", error);
    res.status(500).json({
      message: "Failed to create company"
    });
  }
};

const editCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      company_name,
      description,
      website,
      location,
      logo,
    } = req.body;

    if (!company_name || !company_name.trim()) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    const existingCompany = await getCompanyByUserId(userId);

    if (!existingCompany) {
      return res.status(404).json({
        message: "Company profile not found. Create it first.",
      });
    }

    await updateCompany(
      userId,
      company_name.trim(),
      description || null,
      website || null,
      location || null,
      logo || null
    );

    const updatedCompany = await getCompanyByUserId(userId);

    return res.json({
      message: "Company profile updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update company error:", error);

    return res.status(500).json({
      message: "Failed to update company profile",
    });
  }
};
module.exports = {
  getMyCompany,
  addCompany,
  editCompany,
};
