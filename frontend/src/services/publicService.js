import api from './api';

const publicService = {
  getAllProfiles: async (params = {}) => {
    const response = await api.get('/directory', { params });
    return response.data;
  },

  searchProfiles: async (searchTerm, filters = {}) => {
    const response = await api.get('/directory/search', {
      params: { q: searchTerm, ...filters }
    });
    return response.data;
  },

  getPublicProfile: async (id) => {
    const response = await api.get(`/directory/${id}`);
    return response.data;
  },

  getNews: async (params = {}) => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  getNewsItem: async (slug) => {
    const response = await api.get(`/news/${slug}`);
    return response.data;
  },

  getAnnouncements: async (params = {}) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },

  getAnnouncement: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  }
};

export default publicService;