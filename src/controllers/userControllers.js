require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

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
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

const sendResetPasswordEmail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const myOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Request",
      html: `
        <p>Hi, ${name} <br>
        Please click the below link to reset your password <br>
        <a href="${process.env.HOST_WEBSITE}/?token=${token}">Reset Password Link</a>
        </p>

      `,
    };
    transporter.sendMail(myOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent ", info.response);
      }
    });
  } catch (error) {
    return error.message;
  }
};

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
      password: bcrypt.hashSync(password, 8),
    });

    // Send success message if user created successfully
    if (result)
      res
        .status(201)
        .send({ message: "User registered successfully!", result });
  } catch (error) {
    // Handle any errors
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

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Email or Password!",
      });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name },
      process.env.SECRET_KEY,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: "30d",
      }
    );

    return res.status(200).send({
      _id: user.id,
      email: user.email,
      name: user.name,
      userRole: user.userRole,
      userType: user.userType,
      token: token,
    });
  } catch (error) {
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
      const newPassword = bcrypt.hashSync(password, 8);
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
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  let updates = null;
  if (req?.body?.data) {
    updates = JSON.parse(req?.body?.data);
  }

  if (req?.files || req?.files?.file || req?.files?.file?.length > 0) {
    const result = await uploadToCloudinary(req);
    if (updates !== null) {
      const newData = { ...updates, photoUrl: result };
      await updateUserData(userId, newData, res);
    }else{
      await updateUserData(userId, { photoUrl: result }, res);
    }
  }else{
    if (updates !== null) {
      const newData = { ...updates};
      await updateUserData(userId, newData, res);
    }else{
      return res.status(400).json({message:"Bad request"})
    }
  } 
  
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("applications").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("applications").exec();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
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
};
