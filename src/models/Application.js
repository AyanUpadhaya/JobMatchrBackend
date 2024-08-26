const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true, // Added required: true to ensure jobId is always provided.
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Added required: true to ensure userId is always provided.
  },
  coverLetter: {
    type: String,
    required: true,
  },
  resumeLink: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Applied", "Interview", "Rejected", "Accepted"],
    default: "Applied",
  },
  feedback: {
    type: String,
    required: false,
  },
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
