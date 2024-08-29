require("dotenv").config();
const User = require("../models/User");
const randomstring = require("randomstring");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const generateToken = require("../utils/generateToken");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const { hashPassowrd, comparePassword } = require("../utils/bcryptTools");
const logger = require("../logger/logger");

//update resume
async function updateResumeData(userId, updates, res) {
  try {
    const { resumeLink, resumeOriginalName } = updates;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the resume fields
    user.reseume.resumeLink = resumeLink || user.reseume.resumeLink;
    user.reseume.resumeOriginalName =
      resumeOriginalName || user.reseume.resumeOriginalName;

    // Save the updated user document
    await user.save();

    // Respond with the updated user data
    res.status(200).json({
      message: "Resume updated successfully",
      resume: user.reseume,
    });
  } catch (error) {
    logger.error(error.message || "Error occured: Error updating resume");
    res
      .status(500)
      .json({ message: "An error occurred while updating resume", error });
  }
}

//utility function for update
async function updateUserData(userId, updates, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    logger.error(error.message || "Error occured: updating user data");
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

//create user data
const createUser = async (req, res) => {
  const data = JSON.parse(req?.body?.data);

  const { name, email, password } = data;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      // Return error if username or email already exists
      return res.status(400).send({ message: "Email already exists." });
    }

    // Create the user
    const result = await User.create({
      ...data,
      password: hashPassowrd(password, 8),
    });

    // Send success message if user created successfully
    if (result)
      res
        .status(201)
        .send({ message: "User registered successfully!", result });
  } catch (error) {
    // Handle any errors
    logger.error(error.message || "Error occured: creating user");
    res.status(500).send({ message: error.message });
  }
};

// login user
const signin = async (req, res) => {
  const { email, password } = JSON.parse(req.body.data);
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = comparePassword(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Email or Password!",
      });
    }

    const token = generateToken({
      _id: user._id,
      email: user.email,
      name: user.name,
    });

    return res.status(200).send({
      _id: user.id,
      email: user.email,
      name: user.name,
      userRole: user.userRole,
      userType: user.userType,
      token: token,
    });
  } catch (error) {
    logger.error(error.message || "Error occured: login user");
    return res.status(500).send({ message: error.message });
  }
};

//forgot password
const forgot_password = async (req, res) => {
  const { email } = JSON.parse(req?.body?.data);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const randomString = randomstring.generate();
      const data = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );
      sendResetPasswordEmail(user.name, email, randomString);
      return res
        .status(200)
        .json({ message: "Please check your inbox for mail" });
    }
  } catch (error) {
    logger.error(error.message || "Error occured: forgot password");
    return res.status(500).json({ message: error.message });
  }
};

//reset password
const reset_password = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const tokenData = await User.findOne({ token: tokenId });
    if (tokenData) {
      const { password } = JSON.parse(req?.body?.data);
      const newPassword = hashPassowrd(password, 8);
      const userData = await User.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: newPassword, token: "" } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Password has been reseted", data: userData });
    } else {
      return res
        .status(400)
        .json({ message: "Password reset link has been expired" });
    }
  } catch (error) {
    logger.error(error.message || "Error occured: reset password");
    return res.status(500).json({ message: error.message });
  }
};

//update user data
const updateUser = async (req, res) => {
  const { userId } = req.params;
  let updates = null;
  if (req?.body?.data) {
    updates = JSON.parse(req?.body?.data);
  }

  try {
    // Check if a file is provided for upload
    if (req?.files?.file && req.files.file.length > 0) {
      const [result] = await uploadToCloudinary(req); // Upload file to Cloudinary

      // If both data and file are provided
      if (updates) {
        const newData = { ...updates, photoUrl: result };
        await updateUserData(userId, newData, res); // Update both data and file
      } else {
        // If only the file is provided
        await updateUserData(userId, { photoUrl: result }, res); // Update only file
      }
    } else {
      // If only data is provided
      if (updates) {
        await updateUserData(userId, updates, res); // Update only data
      } else {
        // If neither data nor file is provided
     
        return res
          .status(400)
          .json({ message: "No data or files provided for update." });
      }
    }
  } catch (error) {
    logger.error(error.message || "Error occured: update user data");
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get user by id
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("applications").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(error.message || "Error occured: get user by id");
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//get all users data
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("applications").exec();
    res.status(200).json(users);
  } catch (error) {
    logger.error(error.message || "Error occured: get all users");
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//toggle job save
const toggleSavedJob = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL parameters
    const { jobId } = req?.body?.data; // Extract jobId from request body

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the job is already in savedJobs
    const jobIndex = user.savedJobs.indexOf(jobId);

    if (jobIndex === -1) {
      // If job is not in savedJobs, add it
      user.savedJobs.push(jobId);
    } else {
      // If job is already in savedJobs, remove it
      user.savedJobs.splice(jobIndex, 1);
    }

    // Save the updated user document
    await user.save();

    // Respond with success message
    res.status(200).json({
      message:
        jobIndex === -1
          ? "Job saved successfully"
          : "Job removed from saved jobs",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    logger.error(error.message || "Error occured: toggling saved job");
    res
      .status(500)
      .json({ message: "An error occurred while toggling saved job", error });
  }
};

//get all users saved jobs
const getSavedJobs = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL parameters

    // Find the user by ID and populate the savedJobs field with job details
    const user = await User.findById(userId).populate("savedJobs");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the list of saved jobs
    res.status(200).json({
      message: "Saved jobs retrieved successfully",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    logger.error(error.message || "Error occured:fetching saved jobs");
    res
      .status(500)
      .json({ message: "An error occurred while fetching saved jobs", error });
  }
};

//resume update
const updateResume = async (req, res) => {
  try {
    const { userId } = req.params;
    // Check if a file is provided for upload
    if (req?.files?.file && req.files.file.length > 0) {
      const [resumeLink, resumeOriginalName] = await uploadToCloudinary(req);

      await updateResumeData(userId, { resumeLink, resumeOriginalName }, res);
    } else {
      logger.error(error.message || "Error occured: update resume");
      return res
        .status(400)
        .json({ message: "No data or files provided for update." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//change password
const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = JSON.parse(req.body.data);

  try {
    // Find the admin based on admin id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "user not found." });
    }

    if(!oldPassword || !newPassword){
      return res.status(400).send({ message: "Missing requird fields" });
    }

    // Compare old password hash
    const passwordIsValid = comparePassword(oldPassword, user.password);

    if (!passwordIsValid) {
      return res.status(400).send({ message: "Invalid password." });
    }

    // Hash the new password
    const hashedNewPassword = hashPassowrd(newPassword, 8);

    // Update user's password with the new hash
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    return res.status(200).send({ message: "Password changed successfully!" });
  } catch (error) {
    logger.error(error.message || "Error occured: user password change");
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createUser,
  signin,
  forgot_password,
  reset_password,
  updateUser,
  getUserById,
  getAllUsers,
  toggleSavedJob,
  getSavedJobs,
  updateResume,
  changePassword,
};
