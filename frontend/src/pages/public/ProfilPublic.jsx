import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import profileService from '../../services/profileService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiBriefcase, FiFileText, FiMapPin, FiMail, FiPhone, FiCalendar, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { CATEGORIES, EDUCATION_LEVELS } from '../../constants/categories';

const TabButton = ({ active, onClick, children, icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-inter font-text-medium transition-all duration-300 border-b-2 ${active
      ? 'border-orange text-navy scale-105'
      : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'
      }`}
  >
    {icon}
    {children}
  </button>
);

const InfoItem = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-cream/30 transition">
      <div className="text-orange text-lg mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-navy font-text-medium">{value}</p>
      </div>
    </div>
  );
};

const ExperienceCard = ({ exp, isLast }) => (
  <div className="relative pl-8 pb-8">
    {!isLast && <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gray-100"></div>}
    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white bg-orange shadow-sm z-10"></div>

    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <h4 className="text-lg font-bold text-navy">{exp.title}</h4>
      <p className="text-orange font-medium mb-2">{exp.company}</p>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <FiCalendar />
          <span>
            {new Date(exp.start_date || exp.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
            {' - '}
            {exp.end_date || exp.endDate
              ? new Date(exp.end_date || exp.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
              : 'Poste actuel'
            }
          </span>
        </div>
      </div>

      {exp.description && (
        <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
          {exp.description}
        </p>
      )}
    </div>
  </div>
);



const ProfilPublic = () => {
  const { id } = useParams(); // Can be undefined if accessed via /login (test mode)
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (id) {
        data = await profileService.getProfile(id);
      } else {
        // Fallback for testing via /login or explicit My Profile route
        data = await profileService.getMyProfile();
      }

      setProfile(data);
    } catch (err) {
      console.warn("Erreur fetch profil, utilisation des données MOCK pour démo:", err);
      setProfile(MOCK_PROFILE);

    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.label : catId;
  };

  const getEducationLabel = (levelValue) => {
    const lvl = EDUCATION_LEVELS.find(l => l.value === levelValue);
    return lvl ? lvl.label : levelValue;
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <div className="max-w-md w-full">
          <Alert type="error" message={error} onClose={() => navigate('/')} />
          <button onClick={() => navigate('/')} className="mt-4 w-full py-3 bg-navy text-white rounded-lg">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Normalized data access
  const firstName = profile.first_name || profile.firstName || '';
  const lastName = profile.last_name || profile.lastName || '';
  const fullName = `${firstName} ${lastName}`;
  const jobTitle = profile.sector || 'Professionnel';
  const category = getCategoryLabel(profile.category);
  const education = getEducationLabel(profile.education_level || profile.educationLevel);
  const photoUrl = profile.photoUrl || profile.photo || null;
  const experiences = profile.experiences || [];
  const legalDocs = profile.legalDocs || profile.legal || [];
  const cvUrl = profile.cvUrl || profile.cv;

  return (
    <div className="min-h-screen bg-cream font-inter">
      {/* Header / Hero */}
      <div className="bg-navy pt-8 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-b-[40px] shadow-lg mb-16">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange opacity-10 rounded-bl-full transform translate-x-1/3 -translate-y-1/3"></div>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-white/70 hover:text-white transition flex items-center gap-2"
        >
          <FiArrowLeft /> Retour
        </button>

        <div className="relative max-w-5xl mx-auto flex flex-col items-center z-10 text-center">
          <div className="mb-4 relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              {photoUrl ? (
                <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <FiUser className="text-6xl" />
                </div>
              )}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-poppins font-title-bold text-white mb-2">
            {fullName}
          </h1>
          <p className="text-xl text-orange font-medium mb-1">{jobTitle}</p>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            {(profile.city || profile.country) && (
              <>
                <FiMapPin />
                <span>{profile.city}{profile.city && profile.country ? ', ' : ''}{profile.country}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-20 -mt-20">
        <div className="bg-white rounded-card shadow-card overflow-hidden min-h-[500px]">
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-100 px-4 md:px-8 bg-white/50 backdrop-blur-sm pt-4 justify-center md:justify-start">
            <TabButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={<FiUser />}>
              À propos
            </TabButton>
            <TabButton active={activeTab === 'experiences'} onClick={() => setActiveTab('experiences')} icon={<FiBriefcase />}>
              Parcours
            </TabButton>
            <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={<FiFileText />}>
              Documents
            </TabButton>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-lg font-title text-navy border-b border-gray-100 pb-2 mb-4">Biographie</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {profile.bio || "Aucune biographie renseignée pour le moment."}
                      </p>
                    </div>

                    {profile.skills && (
                      <div>
                        <h3 className="text-lg font-title text-navy border-b border-gray-100 pb-2 mb-4">Compétences</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.split(',').map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-cream text-navy rounded-full text-sm font-medium border border-orange/10">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100">
                    <h3 className="text-md font-bold text-navy mb-4">Informations</h3>
                    <div className="space-y-1">
                      <InfoItem icon={<FiBriefcase />} label="Catégorie" value={category} />
                      <InfoItem icon={<FiUser />} label="Niveau d'études" value={education} />
                      <InfoItem icon={<FiMail />} label="Email" value={profile.email} />
                      <InfoItem icon={<FiPhone />} label="Téléphone" value={profile.phone} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'experiences' && (
                <motion.div
                  key="experiences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 className="text-lg font-title text-navy mb-8">Parcours Professionnel</h3>
                  <div className="max-w-3xl">
                    {experiences.length > 0 ? (
                      experiences.map((exp, idx) => (
                        <ExperienceCard key={idx} exp={exp} isLast={idx === experiences.length - 1} />
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Aucune expérience renseignée.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-2xl mx-auto"
                >
                  {/* CV Section */}
                  <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-orange/30 transition text-center">
                    <div className="inline-flex p-4 bg-orange/10 text-orange rounded-full mb-4">
                      <FiFileText size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-navy mb-2">Curriculum Vitae</h4>
                    <p className="text-gray-500 mb-6">Téléchargez le CV complet pour plus de détails sur le parcours.</p>

                    {cvUrl ? (
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-navy text-white rounded-full hover:bg-navy-light transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <FiDownload /> Télécharger le CV
                      </a>
                    ) : (
                      <button disabled className="inline-flex items-center gap-2 px-8 py-3 bg-gray-100 text-gray-400 rounded-full cursor-not-allowed">
                        CV non disponible
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPublic;
