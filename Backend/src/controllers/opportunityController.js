import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';

// @desc Create new opportunity
// @route POST /opportunities
// @access Private/NGO
export const createOpportunity = async (req, res) => {
  try {
    const { title, description, required_skills, duration, location } = req.body;

    // Validate required fields
    if (!title || !description || !duration || !location) {
      return res.status(400).json({
        message: 'Please provide all required fields',
        errors: [
          !title && 'Title is required',
          !description && 'Description is required',
          !duration && 'Duration is required',
          !location && 'Location is required'
        ].filter(Boolean)
      });
    }

    const opportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title,
      description,
      required_skills: required_skills || [],
      duration,
      location
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all opportunities with optional filters
// @route GET /opportunities
// @access Public
export const getAllOpportunities = async (req, res) => {
  try {
    const { skill, location } = req.query;

    // Build query - only show open opportunities for public access
    const query = { status: 'open' };

    if (skill) {
      query.required_skills = { $in: [skill] };
    }

    if (location) {
      query.location = location;
    }

    const opportunities = await Opportunity.find(query).populate('ngo_id', 'name email location');

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single opportunity by ID
// @route GET /opportunities/:id
// @access Public
export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('ngo_id', 'name email location bio');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc Get NGO's own opportunities
// @route GET /opportunities/my
// @access Private/NGO
export const getMyOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ ngo_id: req.user._id }).sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update opportunity
// @route PUT /opportunities/:id
// @access Private/NGO (owner only)
export const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check ownership
    if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this opportunity' });
    }

    const { title, description, required_skills, duration, location, status } = req.body;

    // Update fields
    if (title) opportunity.title = title;
    if (description) opportunity.description = description;
    if (required_skills !== undefined) opportunity.required_skills = required_skills;
    if (duration) opportunity.duration = duration;
    if (location) opportunity.location = location;
    if (status) opportunity.status = status;

    const updatedOpportunity = await opportunity.save();

    res.json(updatedOpportunity);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete opportunity
// @route DELETE /opportunities/:id
// @access Private/NGO (owner only)
export const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check ownership
    if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this opportunity' });
    }

    // Delete all associated applications first (cascade deletion)
    await Application.deleteMany({ opportunity_id: req.params.id });

    // Delete the opportunity
    await Opportunity.findByIdAndDelete(req.params.id);

    res.json({ message: 'Opportunity and associated applications deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.status(500).json({ message: error.message });
  }
};
