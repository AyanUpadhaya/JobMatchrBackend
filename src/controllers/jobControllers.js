const Job = require("../models/Job");
const Category = require("../models/Category");
const { addJobToCategory } = require("./categoryControllers");
const logger = require("../logger/logger");

const createJob = async (req, res) => {
  try {

    const {
      title,
      description,
      location,
      jobType,
      company,
      categoryId
    } = JSON.parse(req?.body?.data);

    const newJob = new Job({
      title,
      description,
      location,
      jobType,
      company,
      categoryId
    });

    const savedJob = await newJob.save();

    // Add the job to the specified category
    await addJobToCategory(savedJob._id, categoryId);

    res.status(201).json({ message: "Job created successfully!", savedJob });
  } catch (error) {
    logger.error(error.message || "Error occurred: create job");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate({
        path: "applications",
        populate: {
          path: "userId",
          model: "User",
          select: "_id name email jobExperience", // Exclude the password field
        },
      })
      .populate({
        path: "categoryId",
        model: "Category",
      })
      .populate({
        path: "company",
        model: "Company",
      })
      .populate({
        path: "userId",
        model: "User",
      })
      .exec();

    res.status(200).json(jobs);
  } catch (error) {
    logger.error(error.message || "Error occured : get all jobs");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getHiringJobs = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  try {
    // Filtering jobs with status "hiring"
    const hiringJobs = await Job.find({ status: "hiring" })
      .limit(Number(limit)) // Limiting the results
      .skip((Number(page) - 1) * Number(limit)) // Skipping documents for pagination
      .exec(); // Executing the query

    const count = await Job.countDocuments({ status: "hiring" }); // Counting total hiring jobs

    if (!hiringJobs.length) {
      return res.status(200).json({
        jobs: [],
        message: "No more jobs available",
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
      });
    }

    res.status(200).json({
      jobs: hiringJobs,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    logger.error(error.message || "Error occurred : get hiring jobs");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getJobById = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findById(jobId).populate("applications").exec();

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    logger.error(error.message || "Error occured : get job by id");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const updates = JSON.parse(req?.body?.data);

  try {
    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {
      new: true,
    }).exec();

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    logger.error(error.message || "Error occured : update job by id");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    // Find the job by ID
    const job = await Job.findById(jobId).exec();
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (jobs.applications.length > 0) {
      return res.status(400).json({
        message:
          "Job cannot be deleted because it is associated with applications.",
      });
    }

    // Find the category associated with this job
    const category = await Category.findOne({ jobs: jobId }).exec();
    if (category) {
      // Pull the jobId from the category's jobs array
      category.jobs.pull(jobId);
      await category.save();
    }

    // Delete the job
    await job.deleteOne();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    logger.error(error.message || "Error occured : delete job by id");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getJobsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const jobs = await Job.find({ userId })
      .populate({
        path: "applications",
        populate: {
          path: "userId",
          model: "User",
          select: "_id name email jobExperience", // Exclude the password field
        },
      })
      .populate({
        path: "categoryId",
        model: "Category",
      })
      .exec();

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found for this user" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    logger.error(error.message || "Error occured : get jobs by userid");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const addAppIdtoJobApps = async (jobId, appId) => {
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job not found.");
    }
    job.applications.push(appId);
    await job.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateJobStatus = async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body;

  if (!status || !["hiring", "closed"].includes(status)) {
    return res.status(400).json({ message: "Invalid or missing status" });
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true }
    ).exec();

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ message: "Job status updated successfully", updatedJob });
  } catch (error) {
    logger.error(error.message || "Error occured : update job status");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByUserId,
  addAppIdtoJobApps,
  updateJobStatus,
  getHiringJobs,
};
