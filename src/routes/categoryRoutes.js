const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoryControllers");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// Route to create a new category
router.post(
  "/categories",
  verifyToken,
  verifyAdmin,
  categoryControllers.createCategory
);
// Route to get all categories
router.get("/categories", categoryControllers.getAllCategories);
// Route to delete a category if no jobs are associated
router.get(
  "/categories/:categoryId",
 
  categoryControllers.singleCategory
);
router.delete(
  "/categories/:categoryId",
  verifyToken,
  verifyAdmin,
  categoryControllers.deleteCategory
);
// Route to update a category if no jobs are associated
router.put(
  "/categories/:categoryId",
  verifyToken,
  verifyAdmin,
  categoryControllers.updateCategory
);

module.exports = router;
