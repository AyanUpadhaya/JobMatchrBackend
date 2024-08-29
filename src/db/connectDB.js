const mongoose = require("mongoose");
const logger = require("../logger/logger");
const connectDB = async () => {
  try {
    if (process.env.NODE_ENV == "development") {
      await mongoose.connect(process.env.MONGO_URI_DEV);
      logger.log("info", "Connected to development server mongodb");
    } else {
      await mongoose.connect(process.env.MONGO_URI_PROD);
      logger.log("info", "Connected to production server mongodb");
    }
  } catch (error) {
    logger.error(`Failed to connect mongodb`);
    console.log(error);
  }
};
module.exports = connectDB;
