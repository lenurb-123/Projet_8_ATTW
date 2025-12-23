import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, register } = useAuthStore();

  const handleLogin = async (credentials) => {
    await login(credentials);
    navigate('/dashboard');
  };

  const handleRegister = async (userData) => {
    await register(userData);
    navigate('/login', { state: { message: 'Inscription réussie. Veuillez vérifier votre email.' } });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isUser = () => {
    return user?.role === 'user';
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};

export default useAuth;
