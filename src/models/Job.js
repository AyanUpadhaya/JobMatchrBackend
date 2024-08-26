const mongoose = require("mongoose");
const { timekoto } = require("../utils/utils");

const salaryRangeSchema = new mongoose.Schema({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 0 },
});

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    jobType: {
      type: [String],
      enum: ["on-site", "remote", "full-time", "part-time", "contract"],
      default: ["on-site"], // Default is "on-site", can be expanded.
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      required: false,
    },
    aboutCompany: {
      type: String,
      required: false,
    },
    salaryRange: {
      type: salaryRangeSchema,
      default: { min: 0, max: 0 },
    },
    postedDate: {
      type: String,
      default: timekoto("s"),
    },
    tags: {
      type: [String],
      required: false,
    },
    applications: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Added required: true to ensure userId is always provided.
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false, // Added required: true to ensure userId is always provided.
    },

    status: {
      type: String,
      enum: ["hiring", "closed"],
      default: "hiring", // Default to hiring
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
