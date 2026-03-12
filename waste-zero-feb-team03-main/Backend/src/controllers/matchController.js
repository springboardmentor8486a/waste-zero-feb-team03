import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import Notification from '../models/Notification.js';
import {
  rankOpportunitiesForVolunteer,
  rankVolunteersForOpportunity,
} from '../utils/matchingAlgorithm.js';
import { emitToUser } from '../socket/socketServer.js';

/* =====================================
   GET /matches
   Ranked open opportunities for the authenticated volunteer.
===================================== */
export const getMatchesForVolunteer = async (req, res, next) => {
  try {
    const volunteer = req.user; // already populated by protect middleware
    const opportunities = await Opportunity.find({ status: 'open' }).lean();

    const ranked = rankOpportunitiesForVolunteer(volunteer, opportunities);

    res.json({
      count: ranked.length,
      matches: ranked.map(({ opportunity, score, skillScore, locationScore }) => ({
        opportunity,
        matchScore: score,
        skillScore,
        locationScore,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================
   GET /matches/:opportunityId
   Ranked volunteers for an opportunity (NGO must own it).
===================================== */
export const getMatchesForOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId).lean();
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    // NGO ownership check (admins bypass)
    if (
      req.user.role === 'NGO' &&
      opportunity.ngo_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Forbidden: not your opportunity' });
    }

    const volunteers = await User.find({ role: 'volunteer' }).lean();
    const ranked = rankVolunteersForOpportunity(opportunity, volunteers);

    res.json({
      opportunityId,
      count: ranked.length,
      matches: ranked.map(({ volunteer, score, skillScore, locationScore }) => ({
        volunteer: {
          _id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email,
          skills: volunteer.skills,
          location: volunteer.location,
          bio: volunteer.bio,
        },
        matchScore: score,
        skillScore,
        locationScore,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================
   UTILITY (called from opportunityController)
   After an opportunity is created/updated, notify matched volunteers.
===================================== */
export const notifyMatchedVolunteers = async (opportunity) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' }).lean();
    const ranked = rankVolunteersForOpportunity(opportunity, volunteers);

    for (const { volunteer, score } of ranked) {
      const notification = await Notification.create({
        user_id: volunteer._id,
        type: 'newMatch',
        message: `New match: "${opportunity.title}" (${(score * 100).toFixed(0)}% match)`,
        ref_id: opportunity._id,
        ref_type: 'Opportunity',
      });

      emitToUser(volunteer._id, 'newMatch', {
        notification,
        opportunity: {
          _id: opportunity._id,
          title: opportunity.title,
          location: opportunity.location,
        },
        matchScore: score,
      });
    }
  } catch (error) {
    console.error('[notifyMatchedVolunteers]', error.message);
  }
};