// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true,
});

// Intercepteur pour les requêtes (ajout automatique du token)
api.interceptors.request.use(
    (config) => {
        // Gérer FormData
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        
        // Ajouter le token automatiquement si disponible
        const token = localStorage.getItem('auth_token');
        if (token && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour les réponses (gestion erreurs et CSRF)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Gestion erreur CSRF (419)
        if (error.response?.status === 419) {
            await api.get('/sanctum/csrf-cookie');
            return api(error.config);
        }
        
        // Si erreur 401 (non autorisé), déconnecter l'utilisateur
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            delete api.defaults.headers.common['Authorization'];
            
            // Rediriger vers login sauf si on est déjà sur login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;