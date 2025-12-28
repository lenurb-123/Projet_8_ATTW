import api from './api';

const authService = {
  initCSRF: async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      return true;
    } catch (error) {
      return false;
    }
  },

  register: async (userData) => {
    await authService.initCSRF();
    const response = await api.post('/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    await authService.initCSRF();
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