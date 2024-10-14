const Test = require("../models/Test");

const logger = require("../logger/logger");
const cloudinary = require("../config/cloudinary.config");
const getDataUri = require("../utils/datauri");

const createTest = async (req, res) => {
  const data = JSON.parse(req?.body?.data);
  if (!req.files || !req.files.file || req.files.file.length === 0) {
    return res.status(400).json({ message: "Logo is required" });
  }

  if (!data?.name) {
    return res.status(400).json({ message: "Missing required field" });
  }

  try {
    const TestExists = await Test.findOne({ name: data.name });
    if (TestExists) {
      return res.status(400).json({ message: "Test already exists." });
    }
    const file = req.files.file[0];
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    const newData = { ...data, logo: logo };

    const newTest = new Test(newData);
    await newTest.save();

    res.status(201).json({ message: "Test created successfully!", newTest });
  } catch (error) {
    logger.error(error.message || "Error occured : Create Test");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getAllTest = async (req, res) => {
  try {
    const testResponse = await Test.find();
    res.status(200).json(testResponse);
  } catch (error) {
    logger.error(error.message || "Error occured : Get all Test");
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createTest,
  getAllTest,
};
