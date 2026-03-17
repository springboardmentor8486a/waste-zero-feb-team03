import mongoose from "mongoose";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import { notifyMatchedVolunteers } from "./matchController.js";
import { emitToUser } from "../socket/socketServer.js";

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

    notifyMatchedVolunteers(opportunity.toObject());

    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   2. GET ALL OPPORTUNITIES
===================================== */
export const getAllOpportunities = async (req, res, next) => {
  try {
    const { skill, location, status } = req.query;
    const filter = {};

    if (skill)     filter.required_skills = { $in: [skill] };
    if (location)  filter.location = location;
    if (status)    filter.status = status;

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
    const opportunity = await Opportunity.findById(id)
      .populate("ngo_id", "name email location");
    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   4. GET MY OPPORTUNITIES (NGO)
===================================== */
export const getMyOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ ngo_id: req.user._id })
      .sort({ createdAt: -1 });
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

    if (req.body.required_skills !== undefined || req.body.location !== undefined) {
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

    const existingApplication = await Application.findOne({
      opportunity_id: id,
      volunteer_id: req.user._id,
    });

    if (existingApplication || opportunity.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = new Application({
      opportunity_id: id,
      volunteer_id:   req.user._id,
      status:         "pending",
    });
    await application.save();

    opportunity.applicants.push(req.user._id);
    await opportunity.save();

    // Notify the NGO that someone applied 
    const notification = await Notification.create({
      user_id:  opportunity.ngo_id,
      type:     "applicationUpdate",
      message:  `${req.user.name} applied for "${opportunity.title}"`,
      ref_id:   opportunity._id,
      ref_type: "Opportunity",
    });

    emitToUser(opportunity.ngo_id, "notification", notification);

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
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });

    if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to view applicants" });
    }

    const applications = await Application.find({ opportunity_id: id })
      .populate("volunteer_id", "name email");

    const formattedApplicants = applications.map((app) => ({
      _id:            app.volunteer_id._id,
      name:           app.volunteer_id.name,
      email:          app.volunteer_id.email,
      status:         app.status,
      application_id: app._id,
      appliedAt:      app.createdAt,
    }));

    res.json(formattedApplicants);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   9. UPDATE APPLICATION STATUS
   When NGO accepts or rejects → notify the volunteer
===================================== */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id, volunteerId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const opportunity = await Opportunity.findById(id);
    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });

    if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update application status" });
    }

    const application = await Application.findOne({
      opportunity_id: id,
      volunteer_id:   volunteerId,
    });

    if (!application) return res.status(404).json({ message: "Application not found" });

    const previousStatus = application.status;
    application.status   = status;
    await application.save();

    if (status !== previousStatus) {
      const statusMessages = {
        accepted: `🎉 Your application for "${opportunity.title}" was accepted!`,
        rejected: `Your application for "${opportunity.title}" was not selected this time.`,
        pending:  `Your application for "${opportunity.title}" has been set back to pending.`,
      };

      // Save notification to DB
      const notification = await Notification.create({
        user_id:  volunteerId,
        type:     "applicationUpdate",
        message:  statusMessages[status],
        ref_id:   opportunity._id,
        ref_type: "Opportunity",
      });

      emitToUser(volunteerId, "notification", notification);

      if (status === "accepted") {
        emitToUser(volunteerId, "applicationAccepted", {
          notification,
          opportunity: {
            _id:      opportunity._id,
            title:    opportunity.title,
            location: opportunity.location,
          },
        });
      }
    }

    res.json({ message: `Application ${status}`, application });
  } catch (error) {
    next(error);
  }
};