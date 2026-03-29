import api from "./api";

const adminService = {
    getOverview: async () => {
        const response = await api.get('/admin/overview');
        return response; 
    },

    getUsers: async (params) => {
        const response = await api.get('/admin/users', { params });
        return response; 
    },

    updateUserStatus: async (id, status) => {
        const response = await api.patch(`/admin/users/${id}/status`, { status });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.patch(`/admin/users/${id}/status`, { status: 'suspended' });
        return response.data;
    },

    getOpportunities: async (params) => {
        const response = await api.get('/admin/opportunities', { params });
        return response; 
    },

    deleteOpportunity: async (id) => {
        const response = await api.delete(`/admin/opportunities/${id}`);
        return response.data;
    },

    getReports: async (params = {}) => {
        const response = await api.get('/admin/reports', { params });
        return response; 
    },

    getLogs: async (params) => {
        const response = await api.get('/admin/logs', { params });
        return response; 
    }
};

export default adminService;