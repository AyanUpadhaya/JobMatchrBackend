const router  = require('express').Router();
const userControllers = require("../controllers/userControllers");

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
router.get("/user", userControllers.getAllUsers);


module.exports = router;