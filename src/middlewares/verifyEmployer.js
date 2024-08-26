const User = require("../models/User");

const verifyEmployer = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { userRole } = user;
  if (userRole == "employer") {
    next();
  } else {
    return res.status(401).json({ message: "Only employer has access" });
  }
};

module.exports = verifyEmployer;
