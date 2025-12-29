import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, professionalService } from '../../services/allServices.js';
import { FiEdit2, FiSend, FiLogOut } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { PROFILE_STATUS_LABELS } from '../../constants/categories';

const UsagerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setProfile(userData);
      
      // Le statut professionnel vient de professional_profile, pas de l'utilisateur
      try {
        const statusData = await professionalService.getValidationStatus();
        setStatus(statusData.status || 'incomplete');
      } catch (err) {
        // Si pas de professional_profile, le statut est 'incomplete'
        const profStatus = userData.professional_profile?.status;
        setStatus(profStatus || 'incomplete');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation du profil avant soumission
    if (!user?.first_name || !user?.last_name || !user?.phone) {
      setError('Veuillez compléter vos informations personnelles (nom, prénom, téléphone) avant de soumettre votre profil.');
      return;
    }

    if (!user?.profession || !user?.secteur) {
      setError('Veuillez renseigner votre profession et secteur d\'activité avant de soumettre votre profil.');
      return;
    }

    // Vérifier que les documents requis sont uploadés
    if (!profile?.professional_profile?.profile_photo_url) {
      setError('Veuillez uploader votre photo de profil avant de soumettre.');
      return;
    }

    if (!profile?.professional_profile?.cv_url) {
      setError('Veuillez uploader votre CV avant de soumettre.');
      return;
    }

    const legalDocs = profile?.professional_profile?.legal_documents;
    if (!legalDocs || !Array.isArray(legalDocs) || legalDocs.length === 0) {
      setError('Veuillez uploader au moins un document légal (Kbis, certificat, etc.) avant de soumettre.');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir soumettre votre profil pour validation ?')) {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      try {
        await professionalService.submitForApproval();
        setSuccess('Profil soumis avec succès ! Vous recevrez une notification par email.');
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la soumission');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleLogout = async () => {
    await authService.logout();
  };

  const getStatusBadge = () => {
    const badges = {
      incomplete: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Incomplet' },
      pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'En attente' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Validé' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' }
    };
    
    const badge = badges[status] || badges.incomplete;
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Tableau de bord
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FiLogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Bienvenue {user?.first_name} {user?.last_name}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Statut de votre profil :</span>
            {getStatusBadge()}
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Carte Biographie */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Biographie</h3>
            <p className="text-sm text-gray-900 line-clamp-2">
              {profile?.professional_profile?.biography || 'Non renseignée'}
            </p>
          </div>

          {/* Carte Profession */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Profession</h3>
            <p className="text-sm text-gray-900">
              {user?.profession || 'Non renseignée'}
            </p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/usager/profil/edit"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiEdit2 size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Modifier mon profil</h3>
                <p className="text-xs text-gray-500">Mettez à jour vos informations</p>
              </div>
            </Link>

            <button
              onClick={handleSubmit}
              disabled={submitting || status === 'pending'}
              className="flex items-center gap-3 p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiSend size={20} className="text-orange-600" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-900">
                  {submitting ? 'Soumission...' : 'Soumettre pour validation'}
                </h3>
                <p className="text-xs text-gray-500">
                  {status === 'pending' ? 'Déjà en attente' : 'Faire valider mon profil'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Messages de statut */}
        {status === 'pending' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-semibold text-orange-900 mb-1">
              Profil en cours d'examen
            </h3>
            <p className="text-xs text-orange-700">
              Votre profil est actuellement en cours de validation par l'administration. 
              
            </p>
          </div>
        )}

        {status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-semibold text-green-900 mb-1">
              Profil validé ✓
            </h3>
            <p className="text-xs text-green-700">
              Félicitations ! Votre profil est maintenant visible dans l'annuaire public.
            </p>
          </div>
        )}

        {/* Aperçu du profil */}
        {profile && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Aperçu du profil</h2>
              <Link
                to="/usager/profil/edit"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Modifier
              </Link>
            </div>

            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {profile?.first_name || profile?.user?.first_name} {profile?.last_name || profile?.user?.last_name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{profile?.profession || profile?.user?.profession}</p>
                <p className="text-sm text-gray-500">{(profile?.secteur || profile?.user?.secteur)?.toUpperCase()}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm text-gray-900">{profile?.email || profile?.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Téléphone</p>
                    <p className="text-sm text-gray-900">{profile?.phone || profile?.user?.phone || 'Non renseigné'}</p>
                  </div>
                </div>

                {profile?.professional_experiences && profile.professional_experiences.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Expériences professionnelles
                    </p>
                    <p className="text-sm text-gray-900">{profile.professional_experiences.length}</p>
                  </div>
                )}

                {profile?.academic_educations && profile.academic_educations.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Formations académiques
                    </p>
                    <p className="text-sm text-gray-900">{profile.academic_educations.length}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsagerDashboard;