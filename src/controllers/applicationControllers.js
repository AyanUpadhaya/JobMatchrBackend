require("dotenv").config();
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { addAppIdtoJobApps } = require("./jobControllers");

const logger = require("../logger/logger");

const createApplication = async (req, res) => {
  const { jobId, userId, coverLetter } = JSON.parse(req?.body?.data);

  if (!jobId || !userId || !coverLetter) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Validate that the jobId and userId exist
    const job = await Job.findById(jobId);
    const user = await User.findById(userId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has already applied for the job
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const newApp = new Application({
      jobId,
      userId,
      coverLetter
    });

    const saved_app = await newApp.save();
    await addAppIdtoJobApps(jobId, saved_app._id);

    res
      .status(201)
      .json({ message: "Applied for job!", application: saved_app });
  } catch (error) {
    logger.error(error.message || "Error occured : create application");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getApplicationsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await Application.find({ userId })
      .populate("jobId", "title company location jobType") // Populate job details if needed
      .exec();

    if (!applications.length) {
      return res
        .status(404)
        .json({ message: "No applications found for this user" });
    }

    res.status(200).json(applications);
  } catch (error) {
    logger.error(error.message || "Error occured : get application by userid");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { appId } = req.params;
  const { status } = JSON.parse(req?.body?.data);

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const result = await Application.findByIdAndUpdate(
      appId,
      { status },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Application not found" });
    }

    res
      .status(200)
      .json({ message: "Application status updated", application: result });
  } catch (error) {
    logger.error(error.message || "Error occured : update application");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateApplicationFeedback = async (req, res) => {
  const { appId } = req.params;
  const { feedback } = JSON.parse(req?.body?.data);

  if (!feedback) {
    return res.status(400).json({ message: "feedback is required" });
  }

  try {
    const result = await Application.findByIdAndUpdate(
      appId,
      { feedback },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Application not found" });
    }

    res
      .status(200)
      .json({ message: "Application feedback updated", application: result });
  } catch (error) {
    logger.error(error.message || "Error occured : update application");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createApplication,
  updateApplicationStatus,
  getApplicationsByUserId,
  updateApplicationFeedback,
};
