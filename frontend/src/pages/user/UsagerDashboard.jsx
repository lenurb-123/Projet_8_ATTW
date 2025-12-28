import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileService } from '../../services/allServices';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { PROFILE_STATUS_LABELS } from '../../constants/categories';

const UsagerDashboard = () => {
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
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-title-bold text-navy">Mon Espace</h1>
          <p className="text-text mt-2 font-inter">Gérez votre profil professionnel</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Carte Statut */}

          <div className="bg-[#0a1f33ce] p-6 rounded-card shadow-card hover:bg-[#0a1f3382]">
            <h3 className="text-sm font-inter font-text-medium text-[#FFFF] mb-2">Statut du profil</h3>
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-inter font-text-medium ${
                  profile?.user?.status === 'active'
                    ? 'bg-cream border-2 border-orange text-navy'
                    : profile?.user?.status === 'suspended'
                    ? 'bg-cream border-2 border-red-500 text-navy'
                    : 'bg-cream border-2 border-orange-dark text-navy'
                }`}
              >
                {PROFILE_STATUS_LABELS[profile?.user?.status] || 'Non défini'}
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
            {/*<div className="mt-2 w-full bg-cream rounded-full h-2">*/}
            {/*  <div*/}
            {/*    className="bg-orange h-2 rounded-full"*/}
            {/*    style={{ width: `${profile?.professional_experiences?.length || 0}%` }}*/}
            {/*  ></div>*/}
            {/*</div>*/}
          </div>

          {/* Carte Visites */}
          {/*<div className="bg-white p-6 rounded-lg shadow-md">*/}
          {/*  <h3 className="text-sm font-medium text-gray-500 mb-2">Vues du profil</h3>*/}
          {/*  <div className="text-3xl font-bold text-blue-600">*/}
          {/*    {profile?.professional_experiences?.length || 'N/A'}*/}
          {/*  </div>*/}
          {/*  <p className="text-sm text-gray-500 mt-2">Ce mois-ci</p>*/}
          {/*</div>*/}
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
                ✏️
              </div>
              <div className="ml-4">
                <h3 className="font-poppins font-title text-navy">Modifier mon profil</h3>
                <p className="text-sm text-gray-700 font-inter">Mettez à jour vos informations</p>
              </div>
            </Link>

            <Link
              to="/usager/statut"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-[#f9fafb99] transition"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl">
                📊
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Statut de validation</h3>
                <p className="text-sm text-gray-700">Voir l'état de votre demande</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Aperçu du profil */}
        {profile && (
          <div className="bg-[#0a1f330e] rounded-card shadow-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-poppins font-title-bold text-navy">Aperçu du profil</h2>
              <Link
                to="/usager/profil/edit"
                className="p-2 border-2 border-gray-warm rounded-card hover:border-orange hover:bg-[#f9fafb99] transition text-[black] hover:text-orange-dark text-sm font-inter font-text-medium text-[100%]">
                Modifier
              </Link>
            </div>

            <div className="flex items-start">
              <div className="ml-6 flex-1">
                <h3 className="text-2xl font-poppins font-title-bold text-navy">
                  {profile?.user?.first_name} {profile?.user?.last_name}
                </h3>
                <p className="text-gray-900 mt-1">{profile?.user?.profession}</p>
                <p className="text-gray-900">{profile?.user?.secteur?.toUpperCase()}</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-2 border-b-2 border-b-[#00000041] w-1/2">Email</p>
                    <p className="text-gray-900">{profile?.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-2 border-b-2 border-b-[#00000041] w-1/2">Téléphone</p>
                    <p className="text-gray-900">{profile?.user?.phone || 'Non renseigné'}</p>
                  </div>
                </div>
                {profile.professional_experiences && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 mb-2 border-b-2 border-b-[#00000041] w-1/4">Nombre de domaines d'expériences</p>
                      <p className="text-gray-900">{profile.professional_experiences.length}</p>
                    </div>
                )}
                {profile.academic_educations && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 mb-2 border-b-2 border-b-[#00000041] w-1/4">Nombre d'antécédents académiques</p>
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
