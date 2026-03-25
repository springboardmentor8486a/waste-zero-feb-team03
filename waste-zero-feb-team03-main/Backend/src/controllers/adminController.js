import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import AdminLog from '../models/AdminLog.js';

// Helper to log admin actions
const logAdminAction = async (action, adminId, metadata = {}) => {
    try {
        await AdminLog.create({
            action,
            user_id: adminId,
            metadata
        });
    } catch (error) {
        console.error('Failed to log admin action:', error);
    }
};

// @route   GET /admin/overview
// @desc    Get dashboard overview statistics
export const getOverviewStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeNGOs = await User.countDocuments({ role: 'NGO', status: 'active' });
        const activeVolunteers = await User.countDocuments({ role: 'volunteer', status: 'active' });
        const totalOpportunities = await Opportunity.countDocuments();

        const recentLogs = await AdminLog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user_id', 'name email role')
            .populate('metadata.target_user_id', 'name email')
            .populate('metadata.target_opportunity_id', 'title');

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeNGOs,
                activeVolunteers,
                totalOpportunities,
                recentLogs
            }
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /admin/users
// @desc    Get all users with filtering and pagination
export const getUsers = async (req, res, next) => {
    try {
        const { role, status, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (role) filter.role = role === 'ngo' ? 'NGO' : role; // case insensitive match if needed
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(filter)
            .select('-password')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @route   PATCH /admin/users/:id/status
// @desc    Update a user's status (active/suspended)
export const updateUserStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!['active', 'suspended'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        if (req.user._id.toString() === id) {
            return res.status(403).json({ success: false, message: 'Admins cannot suspend themselves' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.status = status;
        await user.save();

        await logAdminAction(`Updated user status to ${status}`, req.user._id, { target_user_id: user._id });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @route   GET /admin/opportunities
// @desc    Get all opportunities with filtering
export const getOpportunities = async (req, res, next) => {
    try {
        const { status, ngo_id, location, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (ngo_id) filter.ngo_id = ngo_id;
        if (location) filter.location = new RegExp(location, 'i');

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const opportunities = await Opportunity.find(filter)
            .populate('ngo_id', 'name email status')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Opportunity.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: opportunities.length,
            total,
            data: opportunities
        });
    } catch (error) {
        next(error);
    }
};

// @route   DELETE /admin/opportunities/:id
// @desc    Admin deletes an opportunity
export const deleteOpportunity = async (req, res, next) => {
    try {
        const { id } = req.params;

        const opportunity = await Opportunity.findByIdAndDelete(id);
        if (!opportunity) {
            return res.status(404).json({ success: false, message: 'Opportunity not found' });
        }

        await logAdminAction('Deleted opportunity', req.user._id, { target_opportunity_id: opportunity._id });

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @route   GET /admin/reports
// @desc    Get metrics for reports/analytics
export const getReports = async (req, res, next) => {
    try {
        // A simple aggregation for user growth by role over time
        const userRoleDistribution = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        const opportunityStatusDistribution = await Opportunity.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                usersByRole: userRoleDistribution,
                opportunitiesByStatus: opportunityStatusDistribution
            }
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /admin/logs
// @desc    Get admin logs with pagination
export const getLogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const logs = await AdminLog.find()
            .populate('user_id', 'name email role')
            .populate('metadata.target_user_id', 'name email')
            .populate('metadata.target_opportunity_id', 'title')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await AdminLog.countDocuments();

        res.status(200).json({
            success: true,
            count: logs.length,
            total,
            data: logs
        });
    } catch (error) {
        next(error);
    }
};
