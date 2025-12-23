import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Pages publiques
import Home from '../pages/public/Home';
import Annuaire from '../pages/public/Annuaire';
import ProfilPublic from '../pages/public/ProfilPublic';

// Pages d'authentification
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Pages usager
import UsagerDashboard from '../pages/user/UsagerDashboard';
import EditProfil from '../pages/user/EditProfil';
import Statut from '../pages/user/Statut';

// Pages admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProfilsList from '../pages/admin/ProfilsList';
import ProfilValidation from '../pages/admin/ProfilValidation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Routes publiques
      { path: '/', element: <Home /> },
      { path: '/annuaire', element: <Annuaire /> },
      { path: '/annuaire/:id', element: <ProfilPublic /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },

      // Routes usager (protégées)
      {
        path: '/usager/dashboard',
        element: (
          <ProtectedRoute>
            <UsagerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/usager/profil/edit',
        element: (
          <ProtectedRoute>
            <EditProfil />
          </ProtectedRoute>
        ),
      },
      {
        path: '/usager/statut',
        element: (
          <ProtectedRoute>
            <Statut />
          </ProtectedRoute>
        ),
      },

      // Routes admin (protégées + admin uniquement)
      {
        path: '/admin/dashboard',
        element: (
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/profils',
        element: (
          <ProtectedRoute adminOnly>
            <ProfilsList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/profils/:id',
        element: (
          <ProtectedRoute adminOnly>
            <ProfilValidation />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}