import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      const data = await profileService.getMyProfile();
      setProfile(data);
    } catch (err) {
      setError('Erreur lors du chargement du statut');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'validated':
        return '✅';
      case 'rejected':
        return '❌';
      case 'modification_requested':
        return '⚠️';
      default:
        return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated':
        return 'bg-cream border-orange';
      case 'rejected':
        return 'bg-cream border-red-500';
      case 'modification_requested':
        return 'bg-cream border-orange-dark';
      default:
        return 'bg-cream border-navy';
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/usager/dashboard" className="text-orange hover:text-orange-dark mb-6 inline-block font-inter font-text-medium">
          ← Retour au tableau de bord
        </Link>

        <h1 className="text-3xl font-poppins font-title-bold text-navy mb-8">Statut de validation</h1>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {profile && (
          <>
            {/* Carte de statut principal */}
            <div className={`border-2 rounded-card p-8 mb-8 shadow-card ${getStatusColor(profile.status)}`}>
              <div className="flex items-center mb-4">
                <span className="text-5xl mr-4">{getStatusIcon(profile.status)}</span>
                <div>
                  <h2 className="text-2xl font-poppins font-title-bold text-navy">
                    {PROFILE_STATUS_LABELS[profile.status] || 'Statut inconnu'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {profile.updatedAt && `Dernière mise à jour: ${new Date(profile.updatedAt).toLocaleDateString('fr-FR')}`}
                  </p>
                </div>
              </div>

              {/* Messages selon le statut */}
              {profile.status === 'pending' && (
                <div className="bg-white bg-opacity-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700">
                    Votre profil est en cours d'examen par notre équipe. Vous recevrez une notification
                    par email dès que votre profil sera validé.
                  </p>
                </div>
              )}

              {profile.status === 'validated' && (
                <div className="bg-white bg-opacity-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700">
                    Félicitations! Votre profil est maintenant visible dans l'annuaire public.
                  </p>
                  <Link
                    to={`/annuaire/${profile.id}`}
                    className="inline-block mt-3 text-orange hover:text-orange-dark font-inter font-text-medium">
                    Voir mon profil public →
                  </Link>
                </div>
              )}

              {profile.status === 'rejected' && (
                <div className="bg-white bg-opacity-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 font-medium mb-2">Raison du rejet:</p>
                  <p className="text-gray-700">
                    {profile.rejectionReason || 'Aucune raison spécifiée'}
                  </p>
                  <Link
                    to="/usager/profil/edit"
                    className="inline-block mt-3 bg-orange text-navy px-4 py-2 rounded-card hover:bg-orange-dark font-inter font-text-medium transition shadow-card">
                    Modifier mon profil
                  </Link>
                </div>
              )}

              {profile.status === 'modification_requested' && (
                <div className="bg-white bg-opacity-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 font-medium mb-2">Modifications demandées:</p>
                  <p className="text-gray-700 mb-3">
                    {profile.modificationComments || 'Veuillez vérifier et mettre à jour vos informations'}
                  </p>
                  <Link
                    to="/usager/profil/edit"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Modifier mon profil
                  </Link>
                </div>
              )}
            </div>

            {/* Timeline de validation */}
            <div className="bg-sand rounded-card shadow-card p-6">
              <h3 className="text-xl font-poppins font-title-bold text-navy mb-6">Historique</h3>
              
              <div className="space-y-6">
                {profile.history?.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange rounded-full flex items-center justify-center">
                      <span className="text-navy font-poppins font-title-bold">{index + 1}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                      {item.comment && (
                        <p className="text-sm text-gray-600 mt-1">{item.comment}</p>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-4">
                    Aucun historique disponible
                  </div>
                )}
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-2">Besoin d'aide?</h3>
              <p className="text-gray-700 text-sm mb-3">
                Si vous avez des questions concernant le statut de votre profil, n'hésitez pas à nous contacter.
              </p>
              <a
                href="mailto:support@plateforme-communautaire.fr"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Contacter le support →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statut;
