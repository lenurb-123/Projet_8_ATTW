import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from "../services/allServices.js";

const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      setUser(null);
      setError('Non authentifié');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      await authService.login(credentials);
      const userData = await checkAuth();

      if (userData?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/usager/dashboard');
      }

      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur de connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      await authService.register(userData);

      navigate('/login', {
        state: {
          message: 'Inscription réussie. Veuillez vérifier votre email.'
        }
      });

      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur d\'inscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isUser = () => {
    return user?.role === 'user';
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    isUser: isUser(),
    handleLogin,
    handleRegister,
    handleLogout,
    refreshAuth: checkAuth
  };
};

export default useAuth;