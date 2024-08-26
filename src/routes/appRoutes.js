const express = require("express");
const {
  createApplication,
  updateApplicationStatus,
  getApplicationsByUserId,
  updateApplicationFeedback,
} = require("../controllers/applicationControllers");
const verifyToken = require("../middlewares/verifyToken");
const verifyEmployer = require("../middlewares/verifyEmployer");
const verifyJobSeeker = require("../middlewares/verifyEmployer");

const router = express.Router();

// Route to create a new application
router.post("/applications",verifyToken,verifyJobSeeker, createApplication);

// Route to update the status of an application by application ID
router.put(
  "/applications/status/:appId",
  verifyToken,
  verifyEmployer,
  updateApplicationStatus
);

//route to update feedback
router.put(
  "/applications/feedback/:appId",
  verifyToken,
  verifyEmployer,
  updateApplicationFeedback
);

// Route to get all applications by user ID
router.get(
  "/applications/user/:userId",
  verifyToken,
  getApplicationsByUserId
);

module.exports = router;
