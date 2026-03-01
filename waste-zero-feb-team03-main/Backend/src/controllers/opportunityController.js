import mongoose from "mongoose";
import Opportunity from "../models/Opportunity.js";

/* =====================================
   CREATE OPPORTUNITY
===================================== */
export const createOpportunity = async (req, res, next) => {
  try {
    const { title, description, required_skills, duration, location } =
      req.body;

    if (!title || !description || !duration || !location) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const opportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title,
      description,
      required_skills: required_skills || [],
      duration,
      location,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   GET ALL OPPORTUNITIES
===================================== */
export const getAllOpportunities = async (req, res, next) => {
  try {
    const { skill, location, status } = req.query;

    const filter = {};

    // Public sees only open
    if (!req.user) {
      filter.status = "open";
    }

    if (skill) {
      filter.required_skills = { $in: [skill] };
    }

    if (location) {
      filter.location = location;
    }

    if (status) {
      filter.status = status;
    }

    const opportunities = await Opportunity.find(filter)
      .populate("ngo_id", "name email location")
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   GET SINGLE OPPORTUNITY
===================================== */
export const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const opportunity = await Opportunity.findById(id).populate(
      "ngo_id",
      "name email location"
    );

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   GET MY OPPORTUNITIES
===================================== */
export const getMyOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({
      ngo_id: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   UPDATE OPPORTUNITY
===================================== */
export const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Ownership check
    if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own opportunities",
      });
    }

    const allowedUpdates = [
      "title",
      "description",
      "required_skills",
      "duration",
      "location",
      "status",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        opportunity[field] = req.body[field];
      }
    });

    const updated = await opportunity.save();

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   DELETE OPPORTUNITY
===================================== */
export const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own opportunities",
      });
    }

    await opportunity.deleteOne();

    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    next(error);
  }
};