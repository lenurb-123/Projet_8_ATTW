import api from './api';

const professionalService = {
    getValidationStatus: async () => {
        const response = await api.get('/professional/status');
        return response.data;
    },

    getPublicView: async () => {
        const response = await api.get('/professional/public-view');
        return response.data;
    },

    uploadDocument: async (file, type = 'photo') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        const response = await api.post('/professional/upload-document', formData);
        return response.data;
    },

    submitForApproval: async () => {
        const response = await api.post('/professional/submit');
        return response.data;
    },

    saveProfessionalProfile: async (profileData, id = null) => {
        if (id) {
            const response = await api.put(`/professional/${id}`, profileData);
            return response.data;
        } else {
            const response = await api.post('/professional/', profileData);
            return response.data;
        }
    },

    getUserAnnouncements: async (params = {}) => {
        const response = await api.get('/user/announcements', { params });
        return response.data;
    },

    getUserNews: async (params = {}) => {
        const response = await api.get('/user-news', { params });
        return response.data;
    }
};

export default professionalService;