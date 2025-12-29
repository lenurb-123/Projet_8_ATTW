// src/services/authService.js
import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/login', credentials);

    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');
    if (token && !api.defaults.headers.common['Authorization']) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const response = await api.get('/user');
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
  }
};

export default authService;