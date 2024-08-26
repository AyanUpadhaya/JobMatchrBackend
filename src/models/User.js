const mongoose = require("mongoose");

const jobExperienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  description: { type: String, required: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: false,
    },
    designation: {
      type: String,
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
    userType: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    userRole: {
      type: String,
      enum: ["employer", "job-seeker"],
      required: false,
    },
    interestedJobTypes: {
      type: [String],
      enum: ["full-time", "part-time", "contract", "remote"],
      required:false
    },
    applications: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
      required: false,
    },
    jobExperience: {
      type: [jobExperienceSchema],
      required: false,
    },
    skills: {
      type: [String],
      required: false,
    },
    token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
