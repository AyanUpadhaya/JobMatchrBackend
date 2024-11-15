const router = require("express").Router();
const {
  createUser,
  signin,
  forgot_password,
  reset_password,
  updateUser,
  getUserById,
  getAllUsers,
  toggleSavedJob,
  getSavedJobs,
  updateResume,
  changePassword,
} = require("../controllers/userControllers");
const verifyToken = require("../middlewares/verifyToken");
//user signup ***
router.post("/user/register", createUser);
//login user ***
router.post("/user/login", signin);
//forgot password api ***
router.post("/user/forgot-password", forgot_password);
//reset password api ***
router.patch("/user/reset-password/:tokenId", reset_password);

// Update user information ***
router.put("/user/:userId", updateUser);
// Get user by ID
router.get("/user/:userId", getUserById);
// Get all users (admin only)
router.get("/user", verifyToken, getAllUsers);

// Route to toggle a job in user's saved jobs list
router.put("/users/:userId/toggle-saved-job", verifyToken, toggleSavedJob);
// Route to get all saved jobs for a user
router.get("/users/:userId/saved-jobs", verifyToken, getSavedJobs);

// Route to update a user's resume
router.patch("/users/:userId/resume", verifyToken, updateResume);

//change user passowrd
router.put("/users/change-password/:userId", verifyToken, changePassword);

module.exports = router;
