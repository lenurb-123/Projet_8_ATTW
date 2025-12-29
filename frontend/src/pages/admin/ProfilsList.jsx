import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { PROFILE_STATUS_LABELS } from '../../constants/categories';

const ProfilsList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [filter, searchTerm]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Utiliser getPendingProfiles pour récupérer les ProfessionalProfiles
      const data = await adminService.getPendingProfiles({
        status: filter !== 'all' ? filter : undefined,
        search: searchTerm,
      });
      
      setProfiles(data.data || data);
    } catch (err) {
      setError('Erreur lors du chargement des profils');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickValidate = async (id) => {
    try {
      await adminService.approveProfile(id);
      fetchProfiles();
    } catch (err) {
      alert("Erreur lors de la validation");
    }
  };

  const handleQuickReject = async (id) => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    try {
      await adminService.rejectProfile(id, reason);
      setProfiles(profiles.filter(p => p.id !== id));
      Alert({ type: 'success', message: 'Profil rejeté' });
    } catch (err) {
      setError('Erreur lors du rejet');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/admin/dashboard" className="text-orange-600 hover:text-orange-700 mb-4 inline-flex items-center text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des profils</h1>
          <p className="text-sm text-gray-600 mt-1">Validez ou modérez les profils</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Filtres */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Nom, email, catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Statut
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              >
                <option value="pending">En attente</option>
                <option value="all">Tous</option>
                <option value="active">Validés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {profiles.length} profil{profiles.length > 1 ? 's' : ''} trouvé{profiles.length > 1 ? 's' : ''}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profil
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
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
                    {profiles.length > 0 ? (
                      profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-semibold">
                                {profile.user?.first_name?.[0]}{profile.user?.last_name?.[0]}
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {profile.user?.first_name} {profile.user?.last_name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{profile.user?.email}</div>
                            <div className="text-xs text-gray-500">{profile.user?.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{profile.category?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{profile.sector?.name || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                profile.approved_at
                                  ? 'bg-green-100 text-green-800'
                                  : profile.rejection_reason
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {profile.approved_at ? 'Validé' : profile.rejection_reason ? 'Rejeté' : 'En attente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-3">
                              <Link
                                to={`/admin/profils/${profile.id}`}
                                className="text-orange-600 hover:text-orange-700 font-medium"
                              >
                                Détails
                              </Link>
                              {!profile.approved_at && !profile.rejection_reason && (
                                <>
                                  <button
                                    onClick={() => handleQuickValidate(profile.id)}
                                    className="text-green-600 hover:text-green-800 font-medium"
                                  >
                                    Valider
                                  </button>
                                  <button
                                    onClick={() => handleQuickReject(profile.id)}
                                    className="text-red-600 hover:text-red-800 font-medium"
                                  >
                                    Rejeter
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                          Aucun profil trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilsList;
