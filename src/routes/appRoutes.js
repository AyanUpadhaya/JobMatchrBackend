const express = require("express");
const {
  createApplication,
  updateApplicationStatus,
  getApplicationsByUserId,
  updateApplicationFeedback,
} = require("../controllers/applicationControllers");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Route to create a new application
router.post("/applications",verifyToken, createApplication);

// Route to update the status of an application by application ID
router.put(
  "/applications/status/:appId",
  verifyToken,
  updateApplicationStatus
);

//route to update feedback
router.put(
  "/applications/feedback/:appId",
  verifyToken,
  updateApplicationFeedback
);

// Route to get all applications by user ID
router.get(
  "/applications/user/:userId",
  verifyToken,
  getApplicationsByUserId
);

module.exports = router;
