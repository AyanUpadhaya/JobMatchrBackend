const logger = require("../logger/logger");

function errorHandler(err, req, res, next) {
  logger.error(err.stack);
  return res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
}

module.exports = errorHandler;
