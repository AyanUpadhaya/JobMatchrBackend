const {
  createCompanyProfile,
  getCompanies,
  getCompanyById,
  getCompanyByUserId,
  updateCompanyById,
  deleteCompanyById,
} = require("../controllers/companyControllers");
const verifyToken = require("../middlewares/verifyToken");
const verifyEmployer = require("../middlewares/verifyEmployer");

const router = require("express").Router();

//create
router.post("/company", verifyToken, createCompanyProfile);

//read
router.get("/company", verifyToken, getCompanies);

//by id
router.get("/company/:companyId", verifyToken, getCompanyById);

//get by user id
router.get(
  "/user/:userId/company",
  verifyToken,

  getCompanyByUserId
);

//update by id
router.put(
  "/company/:companyId",
  verifyToken,

  updateCompanyById
);

//delete by id
router.delete(
  "/company/:companyId",
  verifyToken,

  deleteCompanyById
);

module.exports = router;
