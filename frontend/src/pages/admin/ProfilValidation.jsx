import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { PROFILE_STATUS_LABELS } from '../../constants/categories';

const ProfilValidation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [modificationComments, setModificationComments] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Pour l'instant, on utilise getPublicProfile, à adapter selon votre API
      const data = await adminService.getAllProfiles({ id });
      setProfile(data);
    } catch (err) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!confirm('Êtes-vous sûr de vouloir valider ce profil?')) return;

    try {
      await adminService.validateProfile(id);
      setSuccess('Profil validé avec succès');
      setTimeout(() => navigate('/admin/profils'), 2000);
    } catch (err) {
      setError('Erreur lors de la validation');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Veuillez indiquer une raison');
      return;
    }

    try {
      await adminService.rejectProfile(id, rejectReason);
      setSuccess('Profil rejeté');
      setShowRejectModal(false);
      setTimeout(() => navigate('/admin/profils'), 2000);
    } catch (err) {
      setError('Erreur lors du rejet');
    }
  };

  const handleRequestModification = async () => {
    if (!modificationComments.trim()) {
      setError('Veuillez indiquer les modifications demandées');
      return;
    }

    try {
      await adminService.requestModification(id, modificationComments);
      setSuccess('Demande de modification envoyée');
      setShowModificationModal(false);
      setTimeout(() => navigate('/admin/profils'), 2000);
    } catch (err) {
      setError('Erreur lors de la demande');
    }
  };

  if (loading) return <Loader />;
  if (!profile) return <Alert type="error" message="Profil non trouvé" />;

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/admin/profils" className="text-orange hover:text-orange-dark mb-6 inline-block font-inter font-text-medium">
          ← Retour à la liste
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-poppins font-title-bold text-navy">Validation du profil</h1>
          <p className="text-text mt-2 font-inter font-text">Examinez les informations et documents</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations du profil */}
          <div className="lg:col-span-2 space-y-6">
            {/* En-tête */}
            <div className="bg-sand rounded-card shadow-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-orange rounded-full flex items-center justify-center text-navy text-2xl font-poppins font-title-bold">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-poppins font-title-bold text-navy">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-text font-inter font-text">{profile.category}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-inter font-text-medium ${
                        profile.status === 'validated'
                          ? 'bg-cream text-green-800 border border-green-600'
                          : profile.status === 'rejected'
                          ? 'bg-cream text-red-800 border border-red-600'
                          : 'bg-cream text-orange border border-orange'
                      }`}
                    >
                      {PROFILE_STATUS_LABELS[profile.status]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="bg-sand rounded-card shadow-card p-6">
              <h3 className="text-xl font-poppins font-title-bold text-navy mb-4">Informations personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text font-inter font-text">Email</p>
                  <p className="text-navy font-inter font-text-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-text font-inter font-text">Téléphone</p>
                  <p className="text-navy font-inter font-text-medium">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-text font-inter font-text">Date de naissance</p>
                  <p className="text-navy font-inter font-text-medium">
                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text font-inter font-text">Genre</p>
                  <p className="text-navy font-inter font-text-medium">{profile.gender || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-text font-inter font-text">Adresse</p>
                  <p className="text-navy font-inter font-text-medium">{profile.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="bg-sand rounded-card shadow-card p-6">
              <h3 className="text-xl font-poppins font-title-bold text-navy mb-4">Informations professionnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text font-inter font-text">Catégorie</p>
                  <p className="text-navy font-inter font-text-medium">{profile.category}</p>
                </div>
                <div>
                  <p className="text-sm text-text font-inter font-text">Secteur d'activité</p>
                  <p className="text-navy font-inter font-text-medium">{profile.sector}</p>
                </div>
                <div>
                  <p className="text-sm text-text font-inter font-text">Niveau d'étude</p>
                  <p className="text-navy font-inter font-text-medium">{profile.educationLevel || 'N/A'}</p>
                </div>
              </div>
              
              {profile.bio && (
                <div className="mt-4">
                  <p className="text-sm text-text mb-2 font-inter font-text">Biographie</p>
                  <p className="text-text font-inter font-text">{profile.bio}</p>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="bg-sand rounded-card shadow-card p-6">
              <h3 className="text-xl font-poppins font-title-bold text-navy mb-4">Documents</h3>
              <div className="space-y-3">
                {profile.cvUrl && (
                  <div className="flex items-center justify-between p-3 bg-cream rounded-card">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📄</span>
                      <span className="text-navy font-inter font-text-medium">CV</span>
                    </div>
                    <a
                      href={profile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange hover:text-orange-dark font-inter font-text-medium"
                    >
                      Télécharger
                    </a>
                  </div>
                )}
                {profile.photoUrl && (
                  <div className="flex items-center justify-between p-3 bg-cream rounded-card">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🖼️</span>
                      <span className="text-navy font-inter font-text-medium">Photo</span>
                    </div>
                    <a
                      href={profile.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange hover:text-orange-dark font-inter font-text-medium"
                    >
                      Voir
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="lg:col-span-1">
            <div className="bg-sand rounded-card shadow-card p-6 sticky top-8">
              <h3 className="text-lg font-poppins font-title-bold text-navy mb-4">Actions de validation</h3>
              
              {profile.status === 'pending' && (
                <div className="space-y-3">
                  <button
                    onClick={handleValidate}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-card hover:bg-green-700 flex items-center justify-center font-inter font-text-medium shadow-card transition"
                  >
                    <span className="mr-2">✅</span>
                    Valider le profil
                  </button>

                  <button
                    onClick={() => setShowModificationModal(true)}
                    className="w-full bg-orange text-navy py-2 px-4 rounded-card hover:bg-orange-dark flex items-center justify-center font-inter font-text-medium shadow-card transition"
                  >
                    <span className="mr-2">⚠️</span>
                    Demander modification
                  </button>

                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-card hover:bg-red-700 flex items-center justify-center font-inter font-text-medium shadow-card transition"
                  >
                    <span className="mr-2">❌</span>
                    Rejeter le profil
                  </button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-warm">
                <p className="text-sm text-text mb-2 font-inter font-text">Inscrit le</p>
                <p className="text-navy font-inter font-text-medium">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Rejet */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-sand rounded-card p-6 max-w-md w-full mx-4 shadow-card">
              <h3 className="text-xl font-poppins font-title-bold text-navy mb-4">Rejeter le profil</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Indiquez la raison du rejet..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-warm rounded-card focus:ring-2 focus:ring-orange mb-4 bg-cream font-inter font-text"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-card hover:bg-red-700 font-inter font-text-medium shadow-card transition"
                >
                  Confirmer le rejet
                </button>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border-2 border-gray-warm rounded-card hover:bg-cream font-inter font-text-medium transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Modification */}
        {showModificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-sand rounded-card p-6 max-w-md w-full mx-4 shadow-card">
              <h3 className="text-xl font-poppins font-title-bold text-navy mb-4">Demander des modifications</h3>
              <textarea
                value={modificationComments}
                onChange={(e) => setModificationComments(e.target.value)}
                placeholder="Précisez les modifications à apporter..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-warm rounded-card focus:ring-2 focus:ring-orange mb-4 bg-cream font-inter font-text"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleRequestModification}
                  className="flex-1 bg-orange text-navy py-2 px-4 rounded-card hover:bg-orange-dark font-inter font-text-medium shadow-card transition"
                >
                  Envoyer la demande
                </button>
                <button
                  onClick={() => setShowModificationModal(false)}
                  className="px-4 py-2 border-2 border-gray-warm rounded-card hover:bg-cream font-inter font-text-medium transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilValidation;
