import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import publicService from '../../services/publicService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const ProfilPublic = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await publicService.getPublicProfile(id);
      setProfile(data);
    } catch (err) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;
  if (!profile) return <Alert type="error" message="Profil non trouvé" />;

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/annuaire" className="text-orange hover:text-orange-dark mb-6 inline-block font-inter font-text-medium">
          ← Retour à l'annuaire
        </Link>

        <div className="bg-sand rounded-card shadow-card overflow-hidden">
          {/* En-tête du profil */}
          <div className="bg-navy p-8 text-sand">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-orange rounded-full flex items-center justify-center text-navy text-3xl font-poppins font-title-bold">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-poppins font-title-bold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-warm text-lg mt-1 font-inter">{profile.category}</p>
              </div>
            </div>
          </div>

          {/* Informations du profil */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-inter font-text-medium text-gray-warm mb-1">Secteur d'activité</h3>
                <p className="text-navy font-inter">{profile.sector}</p>
              </div>
              <div>
                <h3 className="text-sm font-inter font-text-medium text-gray-warm mb-1">Niveau d'étude</h3>
                <p className="text-navy font-inter">{profile.educationLevel}</p>
              </div>
              <div>
                <h3 className="text-sm font-inter font-text-medium text-gray-warm mb-1">Email</h3>
                <p className="text-navy font-inter">{profile.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-inter font-text-medium text-gray-warm mb-1">Téléphone</h3>
                <p className="text-navy font-inter">{profile.phone}</p>
              </div>
            </div>

            {profile.bio && (
              <div className="mb-8">
                <h2 className="text-xl font-poppins font-title-bold text-navy mb-4">À propos</h2>
                <p className="text-text leading-relaxed font-inter">{profile.bio}</p>
              </div>
            )}

            {profile.experiences && profile.experiences.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-poppins font-title-bold text-navy mb-4">Expériences</h2>
                <div className="space-y-4">
                  {profile.experiences.map((exp, index) => (
                    <div key={index} className="border-l-4 border-orange pl-4">
                      <h3 className="font-poppins font-title text-navy">{exp.title}</h3>
                      <p className="text-text font-inter">{exp.company}</p>
                      <p className="text-sm text-gray-warm font-inter">{exp.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-poppins font-title-bold text-navy mb-4">Compétences</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-cream border border-orange text-navy px-3 py-1 rounded-full text-sm font-inter"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.languages && profile.languages.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Langues</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPublic;
