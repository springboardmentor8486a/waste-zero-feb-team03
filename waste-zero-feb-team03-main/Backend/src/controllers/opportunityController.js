import mongoose from "mongoose";
import Opportunity from "../models/Opportunity.js";
import { notifyMatchedVolunteers } from "./matchController.js"; // ← Milestone 3 addition

/* =====================================
   1. CREATE OPPORTUNITY
===================================== */
export const createOpportunity = async (req, res, next) => {
  try {
    const { title, description, required_skills, duration, location } = req.body;

    if (!title || !description || !duration || !location) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const opportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title,
      description,
      required_skills: required_skills || [],
      duration,
      location,
      status: "open",
      applicants: [],
    });

    // notify matching volunteers in the background 
    notifyMatchedVolunteers(opportunity.toObject());

    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   2. GET ALL OPPORTUNITIES (Volunteer View)
===================================== */
export const getAllOpportunities = async (req, res, next) => {
  try {
    const { skill, location, status } = req.query;
    const filter = {};

    if (skill) filter.required_skills = { $in: [skill] };
    if (location) filter.location = location;
    if (status) filter.status = status;

    const opportunities = await Opportunity.find(filter)
      .populate("ngo_id", "name email location")
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   3. GET SINGLE OPPORTUNITY
===================================== */
export const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const opportunity = await Opportunity.findById(id).populate("ngo_id", "name email location");
    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   4. GET MY OPPORTUNITIES (NGO Dashboard)
===================================== */
export const getMyOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ ngo_id: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   5. UPDATE OPPORTUNITY
===================================== */
export const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });

    if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update" });
    }

    const allowedUpdates = ["title", "description", "required_skills", "duration", "location", "status"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        opportunity[field] =
          field === "status" ? req.body[field].toLowerCase() : req.body[field];
      }
    });

    const updated = await opportunity.save();

    // re-notify if skills/location changed 
    if (
      req.body.required_skills !== undefined ||
      req.body.location !== undefined
    ) {
      notifyMatchedVolunteers(updated.toObject());
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   6. DELETE OPPORTUNITY
===================================== */
export const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });

    if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete" });
    }

    await opportunity.deleteOne();
    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/* =====================================
   7. APPLY TO OPPORTUNITY
===================================== */
export const applyToOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });
    if (opportunity.status === "closed") {
      return res.status(400).json({ message: "This opportunity is closed." });
    }
    if (opportunity.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: "Already applied" });
    }

    opportunity.applicants.push(req.user._id);
    await opportunity.save();
    res.status(200).json({ message: "Applied successfully!" });
  } catch (error) {
    next(error);
  }
};

/* =====================================
   8. GET APPLICANTS
===================================== */
export const getOpportunityApplicants = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id).populate("applicants", "name email");
    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });
    res.json(opportunity.applicants);
  } catch (error) {
    next(error);
  }
};