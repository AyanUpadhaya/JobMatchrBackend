const router = require("express").Router();
const userControllers = require("../controllers/userControllers");
const verifyToken = require("../middlewares/verifyToken");
//user signup ***
router.post("/user/register", userControllers.createUser);
//login user ***
router.post("/user/login", userControllers.signin);
//forgot password api ***
router.post("/user/forgot-password", userControllers.forgot_password);
//reset password api ***
router.patch("/user/reset-password/:tokenId", userControllers.reset_password);

// Update user information ***
router.put("/user/:userId", userControllers.updateUser);
// Get user by ID
router.get("/user/:userId", userControllers.getUserById);
// Get all users (admin only)
router.get("/user", verifyToken, userControllers.getAllUsers);

// Route to toggle a job in user's saved jobs list
router.put(
  "/users/:userId/toggle-saved-job",
  verifyToken,
  userControllers.toggleSavedJob
);
// Route to get all saved jobs for a user
router.get(
  "/users/:userId/saved-jobs",
  verifyToken,
  userControllers.getSavedJobs
);

// Route to update a user's resume
router.patch(
  "/users/:userId/resume",
  verifyToken,
  userControllers.updateResume
);

//change user passowrd
router.put(
  "/users/change-password/:userId",
  verifyToken,
  userControllers.changePassword
);

module.exports = router;
