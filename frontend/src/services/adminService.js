import api from './api';

const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data.users;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  activateUser: async (id) => {
    const response = await api.post(`/admin/users/${id}/activate`);
    return response.data;
  },

  deactivateUser: async (id) => {
    const response = await api.post(`/admin/users/${id}/deactivate`);
    return response.data;
  },

  suspendUser: async (id, reason = '') => {
    const response = await api.post(`/admin/users/${id}/suspend`, { reason });
    return response.data;
  },

  setUserPending: async (id) => {
    const response = await api.post(`/admin/users/${id}/pending`);
    return response.data;
  },

  getPendingProfiles: async (params = {}) => {
    const response = await api.get('/admin/profile-requests', { params });
    return response.data;
  },

  getProfileForValidation: async (id) => {
    const response = await api.get(`/admin/profile-requests/${id}`);
    return response.data;
  },

  validateProfile: async (id) => {
    const response = await api.post(`/admin/profile-requests/${id}/approve`);
    return response.data;
  },

  approveProfile: async (id) => {
    return adminService.validateProfile(id);
  },

  rejectProfile: async (id, reason) => {
    const response = await api.post(`/admin/profile-requests/${id}/reject`, { reason });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

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

  createProfessionalCategory: async (data) => {
    const response = await api.post('/admin/professional-categories', data);
    return response.data;
  },

  exportUsers: async (format = 'excel', filters = {}) => {
    return await api.post('/admin/export/users',
        {format, filters},
        {responseType: 'blob'}
    );
  }
};

export default adminService;