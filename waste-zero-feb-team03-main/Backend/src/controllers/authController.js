import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import validator from "validator";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// @desc Register User
// @route POST /auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    if (!name || !email || !password || !role || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      location,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login User
// @route POST /auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }
 
    const user = await User.findOne({ email }).select("+password");
 
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
 
    // Block suspended accounts AFTER verifying credentials so we don't leak account existence to someone who doesn't know the password.
    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact support."
      });
    }
 
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Forgot Password
// @route POST /auth/forgotpassword
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "There is no user with that email" });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    // Assumes frontend runs on localhost:5173
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message,
        html: `<p>You are receiving this email because you (or someone else) has requested the reset of a password.</p><p>Please click this link to reset your password:</p><a href="${resetUrl}" target="_blank">${resetUrl}</a>`
      });
      res.status(200).json({ message: "Email sent" });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reset Password
// @route PUT /auth/resetpassword/:token
export const resetPassword = async (req, res) => {
  try {
    // Get hashed token to compare with database
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token or token has expired" });
    }

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

