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
router.post("/company", verifyToken, verifyEmployer, createCompanyProfile);

//read
router.get("/company", verifyToken, verifyEmployer, getCompanies);

//by id
router.get("/company/:companyId", verifyToken, verifyEmployer, getCompanyById);

//get by user id
router.get(
  "/user/:userId/company",
  verifyToken,
  verifyEmployer,
  getCompanyByUserId
);

//update by id
router.put(
  "/company/:companyId",
  verifyToken,
  verifyEmployer,
  updateCompanyById
);

//delete by id
router.delete(
  "/company/:companyId",
  verifyToken,
  verifyEmployer,
  deleteCompanyById
);

module.exports = router;
