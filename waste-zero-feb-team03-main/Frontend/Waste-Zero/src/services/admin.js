import api from "./api";

const adminService = {
    getOverview: async () => {
        const response = await api.get('/admin/overview');
        return response.data;
    },

    getUsers: async (params) => {
        // params can be { page, limit, role, status }
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    updateUserStatus: async (id, status) => {
        const response = await api.patch(`/admin/users/${id}/status`, { status });
        return response.data;
    },

    getOpportunities: async (params) => {
        const response = await api.get('/admin/opportunities', { params });
        return response.data;
    },

    deleteOpportunity: async (id) => {
        const response = await api.delete(`/admin/opportunities/${id}`);
        return response.data;
    },

    getReports: async () => {
        const response = await api.get('/admin/reports');
        return response.data;
    },

    getLogs: async (params) => {
        const response = await api.get('/admin/logs', { params });
        return response.data;
    }
};

export default adminService;
