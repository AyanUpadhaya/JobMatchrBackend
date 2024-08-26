const logger = require("../logger/logger");
const mongoose = require("mongoose");

//starting the server
async function initializeServer(app, port, MONGO_URI) {
  try {
    app.listen(port, () => logger.info(`Server running on port ${port}`));
    await mongoose.connect(MONGO_URI);
    logger.log("info", "Connected to mongodb");
  } catch (error) {
    logger.error("Error starting the server: ", error);
    process.exit(1);
  }
}

module.exports = { initializeServer };
