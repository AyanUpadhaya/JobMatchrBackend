const mongoose = require("mongoose");
const { timekoto } = require("../utils/utils");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job", // Reference to the Job model
      },
    ],
    photoUrl: {
      type: String,
      required: true,
    },
    postedDate: {
      type: String,
      default: timekoto("s"),
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
