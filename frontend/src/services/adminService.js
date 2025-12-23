import api from './api';

const adminService = {
  // Gestion des profils
  getPendingProfiles: async (params) => {
    const response = await api.get('/admin/profiles/pending', { params });
    return response.data;
  },

  getAllProfiles: async (params) => {
    const response = await api.get('/admin/profiles', { params });
    return response.data;
  },

  validateProfile: async (id) => {
    const response = await api.post(`/admin/profiles/${id}/validate`);
    return response.data;
  },

  rejectProfile: async (id, reason) => {
    const response = await api.post(`/admin/profiles/${id}/reject`, { reason });
    return response.data;
  },

  requestModification: async (id, comments) => {
    const response = await api.post(`/admin/profiles/${id}/request-modification`, { comments });
    return response.data;
  },

  // Gestion des utilisateurs
  getUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  activateUser: async (id) => {
    const response = await api.post(`/admin/users/${id}/activate`);
    return response.data;
  },

  suspendUser: async (id, reason) => {
    const response = await api.post(`/admin/users/${id}/suspend`, { reason });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Statistiques
  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  // Exports
  exportData: async (format, filters) => {
    const response = await api.post('/admin/export', { format, filters }, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Catégories
  createCategory: async (data) => {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Secteurs
  createSector: async (data) => {
    const response = await api.post('/admin/sectors', data);
    return response.data;
  },

  updateSector: async (id, data) => {
    const response = await api.put(`/admin/sectors/${id}`, data);
    return response.data;
  },

  deleteSector: async (id) => {
    const response = await api.delete(`/admin/sectors/${id}`);
    return response.data;
  },

  // Actualités
  createNews: async (data) => {
    const response = await api.post('/admin/news', data);
    return response.data;
  },

  updateNews: async (id, data) => {
    const response = await api.put(`/admin/news/${id}`, data);
    return response.data;
  },

  deleteNews: async (id) => {
    const response = await api.delete(`/admin/news/${id}`);
    return response.data;
  },

  // Annonces
  createAnnouncement: async (data) => {
    const response = await api.post('/admin/announcements', data);
    return response.data;
  },

  updateAnnouncement: async (id, data) => {
    const response = await api.put(`/admin/announcements/${id}`, data);
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/admin/announcements/${id}`);
    return response.data;
  },

  // Newsletter
  sendNewsletter: async (data) => {
    const response = await api.post('/admin/newsletter/send', data);
    return response.data;
  },
};

export default adminService;
