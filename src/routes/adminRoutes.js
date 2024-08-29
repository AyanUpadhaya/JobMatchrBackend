const {
  registerAdmin,
  loginAdmin,
  updateAdmin,
  changePassword,
  forgot_password,
  reset_password,
} = require("../controllers/adminControllers");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();
// Admin registration
router.post("/admin/register", registerAdmin);
// Admin login
router.post("/admin/login", loginAdmin);
//Update Admin
router.put("/admin/:adminId", updateAdmin);
//admin password update
router.put("/admin/change-password/:adminId", verifyToken, changePassword);
router.post("/admin/forgot-password", forgot_password);
//reset password api ***
router.patch("/admin/reset-password/:tokenId", reset_password);

module.exports = router;
