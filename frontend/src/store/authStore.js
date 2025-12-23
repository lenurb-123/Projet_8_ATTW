import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(credentials);
      set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur de connexion', loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(userData);
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur d\'inscription', loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
    } finally {
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
