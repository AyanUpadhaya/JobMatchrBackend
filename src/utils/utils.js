const getCurrentUnixTimestamp = () => {
  const currentDate = new Date();
  const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
  return unixTimestamp;
};


const timekoto = (prop) => {
  const date = Date.now();

  if (prop === "m") {
    // Return timestamp in milliseconds
    return date;
  } else {
    // Return timestamp in seconds
    return Math.floor(date / 1000);
  }
};


// Custom AppError class
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Utility to catch async errors
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


module.exports = { getCurrentUnixTimestamp, timekoto, AppError, catchAsync };