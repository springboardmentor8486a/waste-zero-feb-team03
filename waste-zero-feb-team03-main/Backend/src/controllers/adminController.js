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
export const getOverviewStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        
        // Match 'NGO' or 'ngo' and handle missing status field from your DB image
        const activeNGOs = await User.countDocuments({ 
            role: { $in: ['NGO', 'ngo'] },
            $or: [{ status: 'active' }, { status: { $exists: false } }]
        });
        
        const activeVolunteers = await User.countDocuments({ 
            role: { $in: ['volunteer', 'Volunteer'] },
            $or: [{ status: 'active' }, { status: { $exists: false } }]
        });

        const totalOpportunities = await Opportunity.countDocuments();

        const recentLogs = await AdminLog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user_id', 'name email role')
            .catch(() => []); 

        return res.status(200).json({
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
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /admin/users
export const getUsers = async (req, res) => {
    try {
        const { role, status, page = 1, limit = 10 } = req.query;
        const filter = { role: { $ne: 'admin' } };

        if (role) {
            filter.role = role.toLowerCase() === 'ngo' ? { $in: ['NGO', 'ngo'] } : role.toLowerCase();
        }
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const users = await User.find(filter).select('-password').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
        const total = await User.countDocuments(filter);

        return res.status(200).json({ success: true, count: users.length, total, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @route   PATCH /admin/users/:id/status
export const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.status = status;
        await user.save();

        if (req.user) await logAdminAction(`Updated status to ${status}`, req.user._id, { target_user_id: user._id });
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /admin/opportunities
export const getOpportunities = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = status ? { status } : {};
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const data = await Opportunity.find(filter).populate('ngo_id', 'name email').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
        const total = await Opportunity.countDocuments(filter);
        return res.status(200).json({ success: true, total, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @route   DELETE /admin/opportunities/:id
export const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findByIdAndDelete(req.params.id);
        if (!opportunity) return res.status(404).json({ success: false, message: 'Not found' });
        if (req.user) await logAdminAction('Deleted opportunity', req.user._id, { target_opportunity_id: req.params.id });
        return res.status(200).json({ success: true, data: {} });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- ADDED THIS BACK TO FIX THE CRASH ---
// @route   GET /admin/logs
export const getLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const logs = await AdminLog.find()
            .populate('user_id', 'name email role')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        const total = await AdminLog.countDocuments();
        return res.status(200).json({ success: true, count: logs.length, total, data: logs });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /admin/reports
export const getReports = async (req, res) => {
    try {
        const userRoleDistribution = await User.aggregate([
            { $match: { role: { $ne: 'admin' } } },
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        return res.status(200).json({ success: true, data: { usersByRole: userRoleDistribution } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};