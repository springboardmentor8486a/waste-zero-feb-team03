import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
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

        // Always exclude admin account from user management
        const filter = { role: { $ne: 'admin' } };

        if (role) {
            const normalised = role === 'ngo' ? 'NGO' : role;
            if (normalised === 'admin') {
                return res.status(400).json({ success: false, message: 'Cannot filter by admin role' });
            }
            filter.role = normalised;
        }

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
// @desc    Admin deletes a single opportunity (bulk deletion is not permitted)
export const deleteOpportunity = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (Array.isArray(id) || (typeof id === 'string' && id.includes(','))) {
            return res.status(400).json({
                success: false,
                message: 'Bulk deletion is not permitted. Delete one opportunity at a time.'
            });
        }

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
//          Optional query params: from (ISO date), to (ISO date)
//          Example: GET /admin/reports?from=2024-01-01&to=2024-12-31
export const getReports = async (req, res, next) => {
    try {
        // --- Date-range filter ---
        const dateFilter = {};
        if (req.query.from || req.query.to) {
            dateFilter.createdAt = {};
            if (req.query.from) {
                const from = new Date(req.query.from);
                if (isNaN(from)) return res.status(400).json({ success: false, message: 'Invalid "from" date' });
                dateFilter.createdAt.$gte = from;
            }
            if (req.query.to) {
                const to = new Date(req.query.to);
                if (isNaN(to)) return res.status(400).json({ success: false, message: 'Invalid "to" date' });
                // Inclusive: extend "to" to end of that day
                to.setHours(23, 59, 59, 999);
                dateFilter.createdAt.$lte = to;
            }
        }

        // --- User role distribution ---
        const userRoleDistribution = await User.aggregate([
            { $match: { role: { $ne: 'admin' }, ...dateFilter } },  // ← always exclude admin
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // --- Opportunity status distribution ---
        const opportunityStatusDistribution = await Opportunity.aggregate([
            ...(Object.keys(dateFilter).length ? [{ $match: dateFilter }] : []),
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // --- Volunteer response metrics ---
        // Per-opportunity: total applicants, accepted, rejected, pending, acceptance rate
        const volunteerResponseMetrics = await Application.aggregate([
            ...(Object.keys(dateFilter).length ? [{ $match: dateFilter }] : []),
            {
                $group: {
                    _id: '$opportunity_id',
                    total: { $sum: 1 },
                    accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                    pending:  { $sum: { $cond: [{ $eq: ['$status', 'pending']  }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    acceptanceRate: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $round: [{ $multiply: [{ $divide: ['$accepted', '$total'] }, 100] }, 1] },
                            0
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'opportunities',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'opportunity'
                }
            },
            { $unwind: { path: '$opportunity', preserveNullAndEmptyArrays: true } },
            { $match: { 'opportunity._id': { $exists: true } } },
            {
                $project: {
                    opportunityId: '$_id',
                    title: { $ifNull: ['$opportunity.title', '(deleted opportunity)'] },
                    total: 1,
                    accepted: 1,
                    rejected: 1,
                    pending: 1,
                    acceptanceRate: 1,
                    _id: 0
                }
            },
            { $sort: { total: -1 } }
        ]);

        const validOpportunityIds = await Opportunity.distinct('_id');

        const totalApplications = await Application.countDocuments({ 
            ...dateFilter, 
            opportunity_id: { $in: validOpportunityIds } 
        });

        const totalAccepted = await Application.countDocuments({ 
            ...dateFilter, 
            status: 'accepted',
            opportunity_id: { $in: validOpportunityIds }
        });
        const platformAcceptanceRate = totalApplications > 0
            ? Math.round((totalAccepted / totalApplications) * 1000) / 10
            : 0;

        res.status(200).json({
            success: true,
            meta: {
                from: req.query.from || null,
                to:   req.query.to   || null
            },
            data: {
                usersByRole: userRoleDistribution,
                opportunitiesByStatus: opportunityStatusDistribution,
                volunteerResponse: {
                    platformAcceptanceRate,
                    totalApplications,
                    totalAccepted,
                    byOpportunity: volunteerResponseMetrics
                }
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