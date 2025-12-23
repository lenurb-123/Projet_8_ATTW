import api from './api';

const publicService = {
  // Rechercher dans l'annuaire
  searchProfiles: async (params) => {
    const response = await api.get('/public/profiles', { params });
    return response.data;
  },

  // Obtenir un profil public
  getPublicProfile: async (id) => {
    const response = await api.get(`/public/profiles/${id}`);
    return response.data;
  },

  // Obtenir les catégories
  getCategories: async () => {
    const response = await api.get('/public/categories');
    return response.data;
  },

  // Obtenir les secteurs
  getSectors: async () => {
    const response = await api.get('/public/sectors');
    return response.data;
  },

  // Obtenir les actualités
  getNews: async (params) => {
    const response = await api.get('/public/news', { params });
    return response.data;
  },

  // Obtenir une actualité
  getNewsItem: async (id) => {
    const response = await api.get(`/public/news/${id}`);
    return response.data;
  },

  // Obtenir les annonces
  getAnnouncements: async (params) => {
    const response = await api.get('/public/announcements', { params });
    return response.data;
  },
};

export default publicService;
