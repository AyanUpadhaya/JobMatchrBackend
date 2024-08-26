const User = require("../models/User")
const verifyAdmin = async(req, res, next) => {
  const user = await User.findById(req.user._id);
  const { userType } = user;


  if (userType == "admin") {
      next()
  }else{
      return res.status(401).json({message:"Only admin has access"})
  }
};

module.exports = verifyAdmin;
