import User from "../models/User.js";
import validator from "validator";

// @desc Get logged-in user profile
// @route GET /users/me
// @access Private
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update logged-in user profile
// @route PUT /users/me
// @access Private
export const updateMyProfile = async (req, res) => {
  try {

    // Prevent changing email and role
    delete req.body.email;
    delete req.body.role;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.skills = req.body.skills || user.skills;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Change password 
// @route PUT /users/change-password 
// @access Private 
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both current and new passwords are required",
      });
    }

    if (
      !validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      minSymbols: 1,
    })
) {
  return res.status(400).json({
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
  });
}

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

