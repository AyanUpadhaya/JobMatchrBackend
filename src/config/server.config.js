const logger = require("../logger/logger");
const connectDB = require("../db/connectDB");

//starting the server
async function initializeServer(app, port, MONGO_URI) {
  try {
    app.listen(port, () => logger.info(`Server running on port ${port}`));
    await connectDB();
  } catch (error) {
    logger.error("Error starting the server: ", error);
    process.exit(1);
  }
}

module.exports = { initializeServer };
