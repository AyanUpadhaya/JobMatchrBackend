const Company = require("../models/Company");
const logger = require("../logger/logger");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const updateCompanyData = async (companyId, updates, res) => {
  try {
    const company = await Company.findById(companyId).exec();
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const updatedCompany = await Company.findByIdAndUpdate(companyId, updates, {
      new: true,
    }).exec();

    return res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    logger.error(error.message || "Error occurred: update company profile");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

//create company profile

const createCompanyProfile = async (req, res) => {
  const data = JSON.parse(req?.body?.data);
  try {
    // Check if the file is present in the request
    if (!req.files || !req.files.file || req.files.file.length === 0) {
      return res.status(400).json({ message: "Company logo is required" });
    }

    const photoUrl = await uploadToCloudinary(req);

    const newProfile = new Company({ ...data, companyLogo: photoUrl });
    const savedProfile = await newProfile.save();
    res.status(201).json({
      message: "Company profile created successfully!",
      company: savedProfile,
    });
  } catch (error) {
    logger.error(error.message || "Error occurred: create company profile");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

//get companies

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    logger.error(error.message || "Error occurred: delete company profile");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

//get company by id

const getCompanyById = async (req, res) => {
  const { companyId } = req.params;
  try {
    const company = await Company.findById(companyId).exec();
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json(company);
  } catch (error) {
    logger.error(error.message || "Error occurred: get company profile");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

//get company by User id

const getCompanyByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const companys = await Company.find({ userId }).exec();

    if (!companys.length) {
      return res
        .status(404)
        .json({ message: "No companys found for this user" });
    }

    res.status(200).json(companys);
  } catch (error) {
    logger.error(error.message || "Error occured : get companys by userid");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

//update company by id
const updateCompanyById = async (req, res) => {
  const { companyId } = req.params;

  let updates = null;
  if (req?.body?.data) {
    updates = JSON.parse(req?.body?.data);
  }

  if (req?.files || req?.files?.file || req?.files?.file?.length > 0) {
    const result = await uploadToCloudinary(req);
    if (updates !== null) {
      const newData = { ...updates, companyLogo: result };
      await updateCompanyData(companyId, updates, res);
    } else {
      
      await updateCompanyData(companyId, { companyLogo: result }, res);
    }
  } else {
    if (updates !== null) {
      const newData = { ...updates };
      await updateCompanyData(companyId, newData, res);
    } else {
      return res.status(400).json({ message: "Bad request" });
    }
  } 
  
};

//delete company by id
const deleteCompanyById = async (req, res) => {
  const { companyId } = req.params;

  try {
    const company = await Company.findById(companyId).exec();
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await company.deleteOne();
    return res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    logger.error(error.message || "Error occurred: delete company profile");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createCompanyProfile,
  getCompanies,
  getCompanyById,
  getCompanyByUserId,
  updateCompanyById,
  deleteCompanyById,
};
