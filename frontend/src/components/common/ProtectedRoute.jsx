import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth(); // ⬅️ Ajoute loading

  // ⬇️ Affiche un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1F33]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ⬇️ RETIRE LES PARENTHÈSES ! isAdmin est déjà un booléen
  if (adminOnly && !isAdmin) {
    return <Navigate to="/usager/dashboard" replace />; // ⬅️ Corrige aussi la route
  }

  return children;
};

export default ProtectedRoute;