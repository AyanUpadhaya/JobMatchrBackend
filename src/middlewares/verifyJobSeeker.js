const User = require("../models/User");

const verifyJobSeeker = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { userRole } = user;

  if (userRole == "job-seeker") {
    next();
  } else {
    return res.status(401).json({ message: "Only job seeker has access" });
  }
};

module.exports = verifyJobSeeker;


