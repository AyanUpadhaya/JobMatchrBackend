const path = require("path");
const fs = require("fs");
const { TEMP_DIR } = require("./constants");
const cloudinary = require("../config/cloudinary.config");
const logger = require("../logger/logger");

const uploadToCloudinary = async (req) => {
  const fileName = req.files.file[0].filename
  try {
    const filePath = path.join(__dirname, TEMP_DIR, fileName);

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath);

    // Get the secure URL from Cloudinary
    const finalOuput = result.secure_url;

    // Delete the local file after uploading to Cloudinary
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      }
    });

    return [finalOuput, fileName];
  } catch (error) {
    console.log(error);
    logger.error(error.message || "Failed to upload cloudinary")
  }
};

module.exports = uploadToCloudinary;
