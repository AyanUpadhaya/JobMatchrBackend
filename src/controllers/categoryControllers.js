const Category = require("../models/Category");
const logger = require("../logger/logger");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Create a new category
const createCategory = async (req, res) => {
  const data = JSON.parse(req?.body?.data);
  if (!req.files || !req.files.file || req.files.file.length === 0) {
    return res.status(400).json({ message: "Category photo is required" });
  }

  if (!data?.name) {
    return res.status(400).json({ message: "Missing required field" });
  }

  try {
    const categoryExists = await Category.findOne({ name:data.name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const result = await uploadToCloudinary(req);
    const newData = { ...data, photoUrl: result };

    const newCategory = new Category(newData);
    await newCategory.save();
    
    res
      .status(201)
      .json({ message: "Category created successfully!", newCategory });
  } catch (error) {
    logger.error(error.message || "Error occured : Create category");
    res.status(500).json({ message: error.message || "Server error"});
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("jobs");
    res.status(200).json(categories);
  } catch (error) {
    logger.error(error.message || "Error occured : Get all category");
    res.status(500).json({ message: error.message || "Server error"});
  }
};

//get single category 
const singleCategory = async(req,res)=>{
  const { categoryId } = req.params;
  try{
     const category = await Category.findById(categoryId).populate("jobs");
     if (!category) {
       return res.status(404).json({ message: "Category not found." });
     }

     return res.status(200).json(category);

  }catch(error){
    logger.error(error.message || "Error occured : Get single category");
    res.status(500).json({ message: error.message || "Server error" });

  }
}

// Add a job to a category
const addJobToCategory = async (jobId, categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found.");
    }

    category.jobs.push(jobId);
    await category.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Prevent category update or deletion if associated with jobs
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId).populate("jobs");
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (category.jobs.length > 0) {
      return res.status(400).json({
        message:
          "Category cannot be deleted because it is associated with jobs.",
      });
    }
    await Category.findByIdAndDelete(categoryId);
    
    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (error) {
    logger.error(error.message || "Error occured : delete category");
    res.status(500).json({ message: error.message || "Server error"});
  }
};

//update category by id
const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const updates = JSON.parse(req?.body?.data);
  try {
    const category = await Category.findById(categoryId).populate("jobs");
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (category.jobs.length > 0) {
      return res.status(400).json({
        message:
          "Category cannot be updated because it is associated with jobs.",
      });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updates,
      {
        new: true,
      }
    ).exec();

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    
    res
      .status(200)
      .json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    logger.error(error.message || "Error occured : update category");
    res.status(500).json({ message: error.message || "Server error"});
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  addJobToCategory,
  deleteCategory,
  updateCategory,
  singleCategory,
};
