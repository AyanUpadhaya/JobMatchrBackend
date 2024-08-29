const Admin = require("../models/Admin");
const verifyAdmin = async(req, res, next) => {
  const admin = await Admin.findById(req.user._id);
  const { userType } = admin;


  if (userType == "admin") {
      next()
  }else{
      return res.status(401).json({message:"Only admin has access"})
  }
};

module.exports = verifyAdmin;
