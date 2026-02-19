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
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.skills = req.body.skills || user.skills;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;

    if (req.body.email) {
        return res.status(400).json({ message: "Email cannot be changed" });
    }

    if (req.body.role) {
      return res.status(400).json({ message: "Role cannot be changed" });
    }

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
      return res.status(400).json({ message: "All fields are required" }); 
    }

    if (!validator.isStrongPassword(newPassword)) { 
      return res.status(400).json({ 
        message: "Password must be stronger", 
      }); 
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;

    await user.save(); 

    res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};
