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
  const [filter, setFilter] = useState('pending'); // pending, all, validated, rejected
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [filter, searchTerm]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = {
        status: filter !== 'all' ? filter : undefined,
        search: searchTerm,
      };
      
      const data = filter === 'pending' 
        ? await adminService.getPendingProfiles(params)
        : await adminService.getAllProfiles(params);
      
      setProfiles(data.data || []);
    } catch (err) {
      setError('Erreur lors du chargement des profils');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickValidate = async (id) => {
    try {
      await adminService.validateProfile(id);
      setProfiles(profiles.filter(p => p.id !== id));
      Alert({ type: 'success', message: 'Profil validé avec succès' });
    } catch (err) {
      setError('Erreur lors de la validation');
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
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/admin/dashboard" className="text-orange hover:text-orange-dark mb-4 inline-block font-inter font-text-medium">
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-poppins font-title-bold text-navy">Gestion des profils</h1>
          <p className="text-text mt-2 font-inter font-text">Validez ou modérez les profils</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Filtres */}
        <div className="bg-sand rounded-card shadow-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-inter font-text-medium text-navy mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Nom, email, catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-warm rounded-card focus:ring-2 focus:ring-orange bg-cream"
              />
            </div>

            <div>
              <label className="block text-sm font-inter font-text-medium text-navy mb-2">
                Statut
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-warm rounded-card focus:ring-2 focus:ring-orange bg-cream"
              >
                <option value="pending">En attente</option>
                <option value="all">Tous</option>
                <option value="validated">Validés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="mb-4 text-text font-inter font-text">
              {profiles.length} profil{profiles.length > 1 ? 's' : ''} trouvé{profiles.length > 1 ? 's' : ''}
            </div>

            <div className="bg-sand rounded-card shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-warm">
                  <thead className="bg-cream">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-navy uppercase">
                        Profil
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-navy uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-navy uppercase">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-navy uppercase">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-navy uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-inter font-text-medium text-navy uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-sand divide-y divide-gray-warm">
                    {profiles.length > 0 ? (
                      profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-cream">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center text-navy font-poppins font-title-bold">
                                {profile.firstName?.[0]}{profile.lastName?.[0]}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-inter font-text-medium text-navy">
                                  {profile.firstName} {profile.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-navy font-inter font-text">{profile.email}</div>
                            <div className="text-sm text-text font-inter font-text">{profile.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-navy font-inter font-text">{profile.category}</div>
                            <div className="text-sm text-text font-inter font-text">{profile.sector}</div>
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
                              {PROFILE_STATUS_LABELS[profile.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text font-inter font-text">
                            {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Link
                                to={`/admin/profils/${profile.id}`}
                                className="text-orange hover:text-orange-dark font-inter font-text-medium"
                              >
                                Détails
                              </Link>
                              {profile.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleQuickValidate(profile.id)}
                                    className="text-green-600 hover:text-green-800 font-inter font-text-medium"
                                  >
                                    Valider
                                  </button>
                                  <button
                                    onClick={() => handleQuickReject(profile.id)}
                                    className="text-red-600 hover:text-red-800 font-inter font-text-medium"
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
                        <td colSpan="6" className="px-6 py-8 text-center text-text font-inter font-text">
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
