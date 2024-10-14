const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoryControllers");
const verifyToken = require("../middlewares/verifyToken");


// Route to create a new category
router.post("/categories", verifyToken, categoryControllers.createCategory);
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
  categoryControllers.deleteCategory
);
// Route to update a category if no jobs are associated
router.put(
  "/categories/:categoryId",
  verifyToken,
  categoryControllers.updateCategory
);

module.exports = router;
