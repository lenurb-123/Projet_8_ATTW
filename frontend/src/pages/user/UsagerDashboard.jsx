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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setProfile(userData); // Pour compatibilité avec ton design
      
      try {
        const statusData = await professionalService.getValidationStatus();
        setStatus(statusData.status || 'incomplete');
      } catch (err) {
        setStatus(userData.professional_profile?.status || 'incomplete');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir soumettre votre profil pour validation ?')) {
      setSubmitting(true);
      try {
        await professionalService.submitForApproval();
        alert('Profil soumis avec succès ! Vous recevrez une notification par email.');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de la soumission');
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
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Validé' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' }
    };
    
    const badge = badges[status] || badges.incomplete;
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
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
            <h1 className="text-2xl font-bold text-[#0A1F33]">
              Tableau de bord
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#0A1F33] transition-colors"
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
          <h2 className="text-3xl font-bold text-[#0A1F33] mb-2">
            Bienvenue {user?.first_name} {user?.last_name}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Statut de votre profil :</span>
            {getStatusBadge()}
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Carte Statut */}
          <div className="bg-[#0a1f33ce] p-6 rounded-card shadow-card hover:bg-[#0a1f3382]">
            <h3 className="text-sm font-inter font-text-medium text-[#FFFF] mb-2">Statut du profil</h3>
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-inter font-text-medium ${
                  profile?.user?.status === 'active' || status === 'approved'
                    ? 'bg-cream border-2 border-orange text-navy'
                    : profile?.user?.status === 'suspended'
                    ? 'bg-cream border-2 border-red-500 text-navy'
                    : 'bg-cream border-2 border-orange-dark text-navy'
                }`}
              >
                {PROFILE_STATUS_LABELS[profile?.user?.status || status] || PROFILE_STATUS_LABELS[status] || 'Non défini'}
              </span>
            </div>
            <Link
              to="/usager/statut"
              className="mt-4 text-[#fab941] hover:text-[#ffd992] text-sm inline-block font-inter font-text-medium">
              Voir les détails →
            </Link>
          </div>

          {/* Carte Profil */}
          <div className="bg-[#0a1f33ae] p-6 rounded-card shadow-card">
            <h3 className="text-sm font-inter font-text-medium text-[#FFFF] mb-2">Biographie</h3>
            <div className="flex items-center">
              <div className="text-xl font-poppins font-title-bold text-orange">
                {profile?.professional_profile?.biography || 'N/A'}
              </div>
            </div>
          </div>

          {/* Carte Info supplémentaire */}
          <div className="bg-[#0a1f33ae] p-6 rounded-card shadow-card">
            <h3 className="text-sm font-inter font-text-medium text-[#FFFF] mb-2">Profession</h3>
            <div className="flex items-center">
              <div className="text-xl font-poppins font-title-bold text-orange">
                {user?.profession || 'Non renseignée'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-[#0a1f3317] rounded-card shadow-card p-6 mb-8">
          <h2 className="text-xl font-poppins font-title-bold text-navy mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/usager/profil/edit"
              className="flex items-center p-4 border-2 border-gray-warm rounded-card hover:border-orange hover:bg-[#f9fafb99] transition"
            >
              <div className="w-12 h-12 bg-[#fab94190] rounded-card flex items-center justify-center text-navy text-xl">
                <FiEdit2 size={24} />
              </div>
              <div className="ml-4">
                <h3 className="font-poppins font-title text-navy">Modifier mon profil</h3>
                <p className="text-sm text-gray-700 font-inter">Mettez à jour vos informations</p>
              </div>
            </Link>

            <button
              onClick={handleSubmit}
              disabled={submitting || status === 'pending'}
              className="flex items-center p-4 border-2 border-[#E8902C] rounded-card hover:bg-[#E8902C] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-[#E8902C20] rounded-card flex items-center justify-center text-[#E8902C] text-xl">
                <FiSend size={24} />
              </div>
              <div className="ml-4">
                <h3 className="font-poppins font-title">
                  {submitting ? 'Soumission...' : 'Soumettre pour validation'}
                </h3>
                <p className="text-sm font-inter">
                  {status === 'pending' ? 'Déjà en attente' : 'Faire valider mon profil'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Messages de statut */}
        {status === 'pending' && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Profil en cours d'examen
            </h3>
            <p className="text-sm text-yellow-700">
              Votre profil est actuellement en cours de validation par l'administration. 
              Vous recevrez une notification par email dès qu'une décision sera prise.
            </p>
          </div>
        )}

        {status === 'approved' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Profil validé ✓
            </h3>
            <p className="text-sm text-green-700">
              Félicitations ! Votre profil est maintenant visible dans l'annuaire public.
            </p>
          </div>
        )}

        {/* Aperçu du profil */}
        {profile && (
          <div className="bg-[#0a1f330e] rounded-card shadow-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-poppins font-title-bold text-navy">Aperçu du profil</h2>
              <Link
                to="/usager/profil/edit"
                className="p-2 border-2 border-gray-warm rounded-card hover:border-orange hover:bg-[#f9fafb99] transition text-[black] hover:text-orange-dark text-sm font-inter font-text-medium">
                Modifier
              </Link>
            </div>

            <div className="flex items-start">
              <div className="ml-6 flex-1">
                <h3 className="text-2xl font-poppins font-title-bold text-navy">
                  {profile?.first_name || profile?.user?.first_name} {profile?.last_name || profile?.user?.last_name}
                </h3>
                <p className="text-gray-900 mt-1">{profile?.profession || profile?.user?.profession}</p>
                <p className="text-gray-900">{(profile?.secteur || profile?.user?.secteur)?.toUpperCase()}</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-2 border-b-2 border-b-[#00000041] w-1/2">Email</p>
                    <p className="text-gray-900">{profile?.email || profile?.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-2 border-b-2 border-b-[#00000041] w-1/2">Téléphone</p>
                    <p className="text-gray-900">{profile?.phone || profile?.user?.phone || 'Non renseigné'}</p>
                  </div>
                </div>

                {profile?.professional_experiences && profile.professional_experiences.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2 border-b-2 border-b-[#00000041] w-1/4">
                      Nombre de domaines d'expériences
                    </p>
                    <p className="text-gray-900">{profile.professional_experiences.length}</p>
                  </div>
                )}

                {profile?.academic_educations && profile.academic_educations.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2 border-b-2 border-b-[#00000041] w-1/4">
                      Nombre d'antécédents académiques
                    </p>
                    <p className="text-gray-900">{profile.academic_educations.length}</p>
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