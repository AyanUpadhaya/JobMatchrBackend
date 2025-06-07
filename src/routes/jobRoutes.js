const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByUserId,
  updateJobStatus,
  getHiringJobs,
} = require("../controllers/jobControllers");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/jobs",verifyToken, createJob);
router.get("/jobs", getAllJobs);
// router.get("/jobs/:jobId",verifyToken, getJobById);
router.get("/jobs/:jobId", getJobById);
router.put("/jobs/:jobId",verifyToken, updateJob);
router.delete("/jobs/:jobId",verifyToken, deleteJob);
router.get("/user/:userId/jobs",verifyToken, getJobsByUserId);
router.patch("/jobs/:jobId/status",verifyToken, updateJobStatus);
router.get("/jobs/filter/hiring",verifyToken, getHiringJobs);  // Get hiring jobs

module.exports = router;
