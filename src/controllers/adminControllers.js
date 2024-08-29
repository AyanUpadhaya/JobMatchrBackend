require("dotenv").config();
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const { hashPassowrd, comparePassword } = require("../utils/bcryptTools");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const randomstring = require("randomstring");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const logger = require("../logger/logger");

//utility function for update
async function updateUserData(adminId, updates, res) {
  try {
    const updatedUser = await Admin.findByIdAndUpdate(adminId, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    logger.error(error.message || "Error occured: Error updating admin");
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

//register admin
const registerAdmin = async (req, res) => {
  const data = JSON.parse(req?.body?.data);
  const { name, email, password, userType } = data;

  try {
    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password,
      userType,
      adminSecretToken: process.env.ADMIN_SECRET_TOKEN,
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      userType: admin.userType,
      adminSecretToken: admin.adminSecretToken,
    });
  } catch (error) {
    logger.error(error.message || "Error occured: register admin");
    res.status(500).json({ message: "Server error" });
  }
};

//admin login
const loginAdmin = async (req, res) => {
  const data = JSON.parse(req?.body?.data);
  const { email, password } = data;


  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    });

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      userType: admin.userType,
      adminSecretToken: admin.adminSecretToken,
      token: token,
    });
  } catch (error) {
    logger.error(error.message || "Error occured: Error updating resume");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//update admin
const updateAdmin = async (req, res) => {
  const { adminId } = req.params;
  let updates = null;

  // Parse updates if data is provided
  if (req?.body?.data) {
    updates = JSON.parse(req.body.data);
  }

  try {
    // Check if a file is provided for upload
    if (req?.files?.file && req.files.file.length > 0) {
      const [result,fileName] = await uploadToCloudinary(req); // Upload file to Cloudinary
      
      // If both data and file are provided
      if (updates) {
        const newData = { ...updates, photoUrl: result };
        await updateUserData(adminId, newData, res); // Update both data and file
      } else {
        // If only the file is provided
        await updateUserData(adminId, { photoUrl: result }, res); // Update only file
      }
    } else {
      // If only data is provided
      if (updates) {
        await updateUserData(adminId, updates, res); // Update only data
      } else {
        // If neither data nor file is provided
        return res
          .status(400)
          .json({ message: "No data or files provided for update." });
      }
    }
  } catch (error) {
    logger.error(error.message || "Error occured: updating admin data");
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//forgot password
const forgot_password = async (req, res) => {
  const { email } = JSON.parse(req?.body?.data);
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    } else {
      const randomString = randomstring.generate();
      const data = await Admin.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );
      sendResetPasswordEmail(admin.name, email, randomString, "admin");
      return res
        .status(200)
        .json({ message: "Please check your inbox for mail" });
    }
  } catch (error) {
    logger.error(error.message || "Error occured: forgot passowrd");
    return res.status(500).json({ message: error.message });
  }
};

//reset password
const reset_password = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const tokenData = await Admin.findOne({ token: tokenId });
    if (tokenData) {
      const { password } = JSON.parse(req?.body?.data);
      const newPassword = hashPassowrd(password, 8);
      const userData = await Admin.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: newPassword, token: "" } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Password has been reseted", data: userData });
    } else {
      logger.error(error.message || "Error occured: reset password");
      return res
        .status(400)
        .json({ message: "Password reset link has been expired" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//change password
const changePassword = async (req, res) => {
  const { adminId } = req.params;
  const { oldPassword, newPassword } = JSON.parse(req.body.data);

  try {
    // Find the admin based on admin id
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).send({ message: "Admin not found." });
    }

    if(!oldPassword || !newPassword){
      return res.status(400).send({ message: "Missing requird fields" });
    }

    // Compare old password hash
    const passwordIsValid = comparePassword(oldPassword, admin.password);

    if (!passwordIsValid) {
      return res.status(400).send({ message: "Invalid password." });
    }

    // Hash the new password
    const hashedNewPassword = hashPassowrd(newPassword, 8);

    // Update admin's password with the new hash
    await Admin.findByIdAndUpdate(adminId, { password: hashedNewPassword });

    return res.status(200).send({ message: "Password changed successfully!" });
  } catch (error) {
    logger.error(error.message || "Error occured: admin password change");
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  updateAdmin,
  forgot_password,
  reset_password,
  changePassword,
};
