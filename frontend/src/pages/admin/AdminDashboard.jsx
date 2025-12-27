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
      setStats(data);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#E8902C', '#0A1F33', '#0A1F33', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-title-bold text-navy">Tableau de bord Administrateur</h1>
          <p className="text-text mt-2 font-inter font-text">Vue d'ensemble de la plateforme</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#0a1f330a] p-6 rounded-card shadow-card hover:bg-[#0a1f330e]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text mb-1 font-inter font-text">Total Profils</p>
                <p className="text-3xl font-poppins font-title-bold text-orange">{stats?.totalProfiles || 0}</p>
              </div>
              <div className="w-12 h-12 bg-_cream rounded-card flex items-center justify-center ">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <p className="text-sm text-text mt-2 font-inter font-text">
              +{stats?.newProfilesThisMonth || 0} ce mois
            </p>
          </div>

          <div className="bg-[#0a1f330a] p-6 rounded-card shadow-card hover:bg-[#0a1f3311]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text mb-1 font-inter font-text">En attente</p>
                <p className="text-3xl font-poppins font-title-bold text-orange">{stats?.pendingProfiles || 0}</p>
              </div>
              <div className="w-12 h-12 bg-_cream rounded-card flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <Link to="/admin/profils" className="text-sm text-[#f3a44a] hover:text-orange-dark mt-2 inline-block font-inter font-text-medium text-[97%]">
              Voir les profils →
            </Link>
          </div>

          <div className="bg-[#0a1f3314] p-6 rounded-card shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text mb-1 font-inter font-text">Validés</p>
                <p className="text-3xl font-poppins font-title-bold text-green-600">{stats?.validatedProfiles || 0}</p>
              </div>
              <div className="w-12 h-12 bg-_cream rounded-card flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <p className="text-sm text-text mt-2 font-inter font-text">
              {((stats?.validatedProfiles / stats?.totalProfiles) * 100 || 0).toFixed(1)}% du total
            </p>
          </div>

          <div className="bg-[#0a1f3314] p-6 rounded-card shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text mb-1 font-inter font-text">Rejetés</p>
                <p className="text-3xl font-poppins font-title-bold text-red-600">{stats?.rejectedProfiles || 0}</p>
              </div>
              <div className="w-12 h-12 bg-_cream rounded-card flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
            </div>
            <p className="text-sm text-text mt-2 font-inter font-text">
              {((stats?.rejectedProfiles / stats?.totalProfiles) * 100 || 0).toFixed(1)}% du total
            </p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-[#0a1f33a0] rounded-card shadow-card p-6 mb-12">
          <h2 className="text-xl font-poppins font-title-bold text-white mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/profils"
              className="flex items-center p-4 border border-gray-warm rounded-card bg-[#fefefe5f] text-navy hover:bg-[#faf7f2c9] transition"
            >
              <div className="w-12 h-12 bg-[#f4ae5ee7] rounded-card flex items-center justify-center text-navy text-xl">
                📋
              </div>
              <div className="ml-4">
                <h3 className="font-poppins font-title-medium text-navy">Gérer les profils</h3>
                <p className="text-sm text-text font-inter font-text">Validation et modération</p>
              </div>
            </Link>

            <button
              onClick={() => adminService.exportData('excel', {})}
              className="flex items-center p-4 border border-gray-warm rounded-card bg-[#fefefe91] text-navy hover:bg-[#faf7f2c9] transition text-left"
            >
              <div className="w-12 h-12 bg-[#f4ae5ee7] rounded-card flex items-center justify-center text-navy text-xl">
                📊
              </div>
              <div className="ml-4">
                <h3 className="font-poppins font-title-medium text-navy">Exporter les données</h3>
                <p className="text-sm text-text font-inter font-text">Excel, PDF, CSV</p>
              </div>
            </button>

            <Link
              to="/admin/users"
              className="flex items-center p-4 border border-gray-warm rounded-card bg-[#fefefe5f] text-navy hover:bg-[#faf7f2c9] transition"
            >
              <div className="w-12 h-12 bg-[#f4ae5ee7] rounded-card flex items-center justify-center text-navy text-xl">
                👤
              </div>
              <div className="ml-4">
                <h3 className="font-poppins font-title-medium text-navy">Gérer les utilisateurs</h3>
                <p className="text-sm text-text font-inter font-text">Comptes et permissions</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Graphiques */}
        <section className="pt-6 border border-[#627b833c] rounded-t-3xl">
          <div className=" flex px-1 ">
            <h2 className="w-[90%] ml-9 mb-4 text-xl font-poppins font-title-bold text-text "> Visualisation Graphique des Statistiques </h2>
            <span id='spanCut' className=" p-1 px-2 m-auto mb-5 rounded-full border border-black cursor-pointer rotate-180"
             onClick={
              () => {
                // params
                var spanCut = document.getElementById('spanCut');
                var visualz = document.getElementById('graphics');
                // Operations
                spanCut.style.transition = 'all 0.8s ease-in-out';
                spanCut.style.backgroundColor == '' ? spanCut.style.backgroundColor='rgba(0,0,0,30%)' : spanCut.style.backgroundColor='';
                spanCut.style.rotate == '180deg' ? spanCut.style.rotate = '0deg' : spanCut.style.rotate = '180deg';
                visualz.style.display == '' ? visualz.style.display='none' : visualz.style.display='';
              }
            }> ▼ </span>
          </div>
          { /** */ }
          <div id='graphics' className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Répartition par catégorie */}
            <div className="bg-[#d4d4d455] rounded-card shadow-card p-3 border-2 rounded-e-3xl group [perspective:100px] ">
              <h2 className="text-xl font-poppins font-title-bold text-navy mb-4 border-b border-[#627b838c] pb-1">Répartition par catégorie</h2>
              {stats?.categoryDistribution && stats.categoryDistribution.length > 0 ? (
                <div className="flex justify-center bg-[#ffffff67]">
                  <PieChart width={350} height={300}>
                    <Pie
                      data={stats.categoryDistribution}
                      cx={175}
                      cy={150}
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
                </div>
              ) : (
                <p className="text-center text-text py-8 font-inter font-text">Aucune donnée disponible</p>
              )}
            </div>

            {/* Évolution des inscriptions */}
            <div className="bg-[#0a1f3397] rounded-card shadow-card p-6">
              <h2 className="text-xl font-poppins font-title-bold text-white mb-4 border-b pb-1">Inscriptions (6 derniers mois)</h2>
              {stats?.registrationTrend && stats.registrationTrend.length > 0 ? (
                <div class="h-[300px] bg-[#ffffffd8]">
                  <ResponsiveContainer>
                    <BarChart width={500} height={300} data={stats.registrationTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#E8902C" name="Inscriptions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-white py-8 font-inter font-text">Aucune donnée disponible</p>
              )}
            </div>
          </div>
        </section>

        {/* Profils récents */}
        <div className="bg-[#0a1f3397] rounded-card shadow-card p-6 mt-12 mb-3">
          <h2 className="text-xl font-poppins font-title-bold text-white mb-4">Dernières inscriptions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-warm">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-white uppercase">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-white uppercase">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-white uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-white uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-white uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#0a1f33] divide-y divide-gray-warm">
                {stats?.recentProfiles?.map((profile) => (
                  <tr key={profile.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-inter font-text-medium text-white">
                        {profile.firstName} {profile.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-inter font-text">
                      {profile.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-inter font-text-medium ${
                          profile.status === 'validated'
                            ? 'bg-cream text-green-800 border border-green-600'
                            : profile.status === 'rejected'
                            ? 'bg-cream text-red-800 border border-red-600'
                            : 'bg-cream text-orange border border-orange'
                        }`}
                      >
                        {profile.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-inter font-text">
                      {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/admin/profils/${profile.id}`}
                        className="text-[#e7af6e] hover:text-orange-dark font-inter font-text-medium"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-white font-inter font-text">
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
