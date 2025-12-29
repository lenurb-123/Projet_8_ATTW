import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiClock, FiArrowLeft, FiEdit3, FiMail } from 'react-icons/fi';
import profileService from '../../services/profileService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { PROFILE_STATUS_LABELS } from '../../constants/categories';

const Statut = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getMyProfile();
      // Backend retourne {user: {...}, professional_profile: {...}}
      const userData = response.user || response;
      const professionalProfile = response.professional_profile || userData.professional_profile;
      
      // Combiner les données user + professional_profile
      const combinedProfile = {
        ...userData,
        professional_status: professionalProfile?.status || 'incomplete',
        professional_profile: professionalProfile
      };
      
      setProfile(combinedProfile);
    } catch (err) {
      setError('Erreur lors du chargement du statut');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'validated':
      case 'approved':
        return { 
          icon: FiCheckCircle, 
          color: 'text-green-600', 
          bg: 'bg-green-50', 
          border: 'border-green-200' 
        };
      case 'rejected':
        return { 
          icon: FiXCircle, 
          color: 'text-red-600', 
          bg: 'bg-red-50', 
          border: 'border-red-200' 
        };
      case 'modification_requested':
        return { 
          icon: FiAlertCircle, 
          color: 'text-orange-600', 
          bg: 'bg-orange-50', 
          border: 'border-orange-200' 
        };
      default:
        return { 
          icon: FiClock, 
          color: 'text-gray-600', 
          bg: 'bg-gray-50', 
          border: 'border-gray-200' 
        };
    }
  };

  const statusConfig = getStatusConfig(profile?.professional_status || profile?.status);
  const StatusIcon = statusConfig.icon;
  const currentStatus = profile?.professional_status || profile?.status || 'incomplete';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/usager/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FiArrowLeft size={16} />
            Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Statut de validation</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {profile && (
          <>
            {/* Carte de statut principal */}
            <div className={`bg-white border ${statusConfig.border} rounded-lg p-6 mb-6`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${statusConfig.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <StatusIcon size={24} className={statusConfig.color} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {PROFILE_STATUS_LABELS[currentStatus] || 'Statut inconnu'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {profile.updatedAt 
                      ? `Dernière mise à jour : ${new Date(profile.updatedAt).toLocaleDateString('fr-FR')}` 
                      : 'Aucune mise à jour récente'}
                  </p>
                </div>
              </div>

              {/* Messages selon le statut */}
              {currentStatus === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-700">
                    Votre profil est en cours d'examen par notre équipe. Vous recevrez une notification
                    par email dès qu'une décision sera prise.
                  </p>
                </div>
              )}

              {(currentStatus === 'validated' || currentStatus === 'approved') && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-700 mb-3">
                    Félicitations ! Votre profil est maintenant visible dans l'annuaire public.
                  </p>
                  <Link
                    to={`/annuaire/${profile.id}`}
                    className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Voir mon profil public →
                  </Link>
                </div>
              )}

              {currentStatus === 'rejected' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Raison du rejet</p>
                  <p className="text-sm text-gray-700 mb-4">
                    {profile.rejectionReason || 'Aucune raison spécifiée'}
                  </p>
                  <Link
                    to="/usager/profil/edit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition"
                  >
                    <FiEdit3 size={16} />
                    Modifier mon profil
                  </Link>
                </div>
              )}

              {currentStatus === 'modification_requested' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Modifications demandées</p>
                  <p className="text-sm text-gray-700 mb-4">
                    {profile.modificationComments || 'Veuillez vérifier et mettre à jour vos informations'}
                  </p>
                  <Link
                    to="/usager/profil/edit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition"
                  >
                    <FiEdit3 size={16} />
                    Modifier mon profil
                  </Link>
                </div>
              )}
              
              {currentStatus === 'incomplete' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-700 mb-4">
                    Votre profil est incomplet. Complétez vos informations et soumettez-le pour validation.
                  </p>
                  <Link
                    to="/usager/profil/edit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition"
                  >
                    <FiEdit3 size={16} />
                    Compléter mon profil
                  </Link>
                </div>
              )}
            </div>

            {/* Timeline de validation */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Historique</h3>
              
              <div className="space-y-4">
                {profile.history?.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-orange-600">{index + 1}</span>
                    </div>
                    <div className="flex-1 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                      {item.comment && (
                        <p className="text-sm text-gray-600 mt-2">{item.comment}</p>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-sm text-gray-500 py-6">
                    Aucun historique disponible
                  </div>
                )}
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Besoin d'aide ?</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Si vous avez des questions concernant le statut de votre profil, n'hésitez pas à nous contacter.
                  </p>
                  <a
                    href="mailto:support@plateforme-communautaire.fr"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Contacter le support →
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statut;
