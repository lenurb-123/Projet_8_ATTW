import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStatistics();

      const mappedStats = {
        totalProfiles: (data.profiles_by_validation?.approved || 0) +
            (data.profiles_by_validation?.pending || 0) +
            (data.profiles_by_validation?.rejected || 0),
        newProfilesThisMonth: data.registration_trend?.[data.registration_trend.length - 1]?.count || 0,
        pendingProfiles: data.profiles_by_validation?.pending || 0,
        validatedProfiles: data.profiles_by_validation?.approved || 0,
        rejectedProfiles: data.profiles_by_validation?.rejected || 0,

        categoryDistribution: data.users_by_category?.map(cat => ({
          name: cat.name,
          value: cat.users_count
        })) || [],

        registrationTrend: data.registration_trend?.map(item => ({
          month: item.label,
          count: item.count
        })) || [],

        recentProfiles: data.recent_users?.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          status: user.status,
          createdAt: user.created_at,
          category: user.professional_profile?.category?.name
        })) || []
      };

      setStats(mappedStats);

    } catch (err) {
      setError('Impossible de charger les statistiques');
      console.error('Erreur dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#E8902C', '#0A1F33', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Profils</p>
            <p className="text-3xl font-semibold text-gray-900">{stats?.totalProfiles || 0}</p>
            <p className="text-xs text-gray-600 mt-2">
              +{stats?.newProfilesThisMonth || 0} ce mois
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">En attente</p>
            <p className="text-3xl font-semibold text-orange-600">{stats?.pendingProfiles || 0}</p>
            <Link to="/admin/profils" className="text-xs text-orange-600 hover:text-orange-700 mt-2 inline-block">
              Voir les profils →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Validés</p>
            <p className="text-3xl font-semibold text-green-600">{stats?.validatedProfiles || 0}</p>
            <p className="text-xs text-gray-600 mt-2">
              {((stats?.validatedProfiles / stats?.totalProfiles) * 100 || 0).toFixed(1)}% du total
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Rejetés</p>
            <p className="text-3xl font-semibold text-red-600">{stats?.rejectedProfiles || 0}</p>
            <p className="text-xs text-gray-600 mt-2">
              {((stats?.rejectedProfiles / stats?.totalProfiles) * 100 || 0).toFixed(1)}% du total
            </p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/profils"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Gérer les profils</h3>
                <p className="text-xs text-gray-500">Validation et modération</p>
              </div>
            </Link>

            <button
              onClick={() => adminService.exportUsers('excel', {})}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Exporter les données</h3>
                <p className="text-xs text-gray-500">Excel, PDF, CSV</p>
              </div>
            </button>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Gérer les utilisateurs</h3>
                <p className="text-xs text-gray-500">Comptes et permissions</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Graphiques */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">Statistiques</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Répartition par catégorie */}
            <div className="border-l-2 border-gray-200 pl-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Répartition par catégorie</h3>
              {stats?.categoryDistribution && stats.categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#E8902C"
                      dataKey="value"
                    >
                      {stats.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-8 text-sm">Aucune donnée disponible</p>
              )}
            </div>

            {/* Évolution des inscriptions */}
            <div className="border-l-2 border-gray-200 pl-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Inscriptions (6 derniers mois)</h3>
              {stats?.registrationTrend && stats.registrationTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.registrationTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#E8902C" name="Inscriptions" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-8 text-sm">Aucune donnée disponible</p>
              )}
            </div>
          </div>
        </div>

        {/* Profils récents */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Dernières inscriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.recentProfiles && stats.recentProfiles.length > 0 ? (
                  stats.recentProfiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {profile.name}
                        </div>
                        <div className="text-xs text-gray-500">{profile.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {profile.category || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            profile.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : profile.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : profile.status === 'suspended'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {profile.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/admin/profils/${profile.id}`}
                          className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                      Aucune inscription récente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
