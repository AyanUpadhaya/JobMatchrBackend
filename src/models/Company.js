const mongoose = require("mongoose");
const { timekoto } = require("../utils/utils");
const companySchema = new mongoose.Schema(
  {
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
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    companyType: {
      type: String,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Added required: true to ensure userId is always provided.
    },
    postedDate: {
      type: String,
      default: timekoto("s"),
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
