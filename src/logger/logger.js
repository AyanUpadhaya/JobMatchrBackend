// middlewares/logger.js
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const fs = require("fs");
const path = require("path");
const logDirectory = "src/logger/logs";
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
// Define custom format for logs
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: "info", // Adjust level to include info logs as well
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }), 
    // new transports.File({
    //   filename: path.join(logDirectory, "app.log"),
    //   level: "info",
    // }), 
    new transports.Console(), // Log everything to console
  ],
});

// Stream for morgan
logger.stream = {
  write: (message) => {
    // Use 'info' level for request logs
    logger.info(message.trim());
  },
};

module.exports = logger;
