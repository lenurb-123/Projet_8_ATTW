import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService, professionalService } from '../../services/allServices';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { CATEGORIES, EDUCATION_LEVELS, getCategoryBackendId } from '../../constants/categories';
import { SECTORS, getSectorIdByName } from '../../constants/sectors';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiBriefcase, FiFileText, FiCamera, FiPlus, FiTrash2, FiMapPin, FiPhone, FiEye } from 'react-icons/fi';

const StepIndicator = ({ step, currentStep, label, icon }) => {
  const isCompleted = currentStep > step;
  const isActive = currentStep === step;
  
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
          isCompleted 
            ? 'bg-green-600 text-white' 
            : isActive 
            ? 'bg-orange text-white scale-110' 
            : 'bg-gray-200 text-gray-400'
        }`}>
          {isCompleted ? '✓' : step}
        </div>
        <span className={`text-xs mt-2 font-medium ${isActive ? 'text-navy' : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
    </div>
  );
};

const DocumentListItem = ({ type, file, onDelete, index }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-orange/10 flex items-center justify-center text-orange text-xl">
        <FiFileText />
      </div>
      <div>
        <p className="font-medium text-navy capitalize">
          {type === 'cv' ? 'Curriculum Vitae' : `Document Légal ${index !== undefined ? index + 1 : ''}`}
        </p>
        <p className="text-xs text-gray-500">Ajouté récemment</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {file && (
        <>
          <a
            href={typeof file === 'string' ? file : URL.createObjectURL(file)}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-gray-400 hover:text-navy transition"
            title="Voir"
          >
            <FiEye size={20} />
          </a>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 transition"
            title="Supprimer"
          >
            <FiTrash2 size={20} />
          </button>
        </>
      )}
    </div>
  </div>
);

const EditProfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, ou 3
  const [canSubmit, setCanSubmit] = useState(false); // Empêcher la soumission automatique
  const [files, setFiles] = useState({ photo: null, cv: null, legal: [] });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    profession: '',
    category: '',
    secteur: '',
    sector: '',
    education_level: '',
    skills: '',
    bio: '',
    experiences: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    // name is like "experiences[0][title]" but we can just use the field name from a simpler implementation or parse it if strictly keeping name attributes
    // Simpler: pass the field key directly
    const field = name.split('.').pop() || name.split(']').slice(-2)[0].replace('[', '');

    // Actually, let's keep it simple and just rely on the 'name' attribute structure "experiences[index][field]" might be hard to parse generically without logic.
    // Instead we will update the inputs to pass the field name explicitly to a handler or parse the name.

    // Better approach matching the previous structure:
    const updatedExperiences = [...formData.experiences];
    // We need to know which property to update. 
    // Let's assume the name on input is like "experiences[0][title]"
    // But we can also just use a helper that takes (index, field, value)
  };

  // Revised handlers
  const updateExperience = (index, field, value) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, experiences: updatedExperiences }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { title: '', company: '', start_date: '', end_date: '', description: '' }
      ]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => {
      const newExp = [...prev.experiences];
      newExp.splice(index, 1);
      return { ...prev, experiences: newExp };
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getMyProfile();
      const data = response.user || response; // Backend retourne {user: {...}, professional_profile: {...}}
      const professionalProfile = data.professional_profile || response.professional_profile || {};

      setFormData({
        first_name: data.first_name || data.firstName || '',
        last_name: data.last_name || data.lastName || '',
        birth_date: data.birth_date || data.dateOfBirth || data.birthDate || '',
        gender: data.gender || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
        profession: data.profession || '',
        category: data.category_id || data.category || professionalProfile.category_id || '',
        secteur: data.secteur || '',
        sector: data.secteur || data.sector || '',
        education_level: professionalProfile.education_level || data.education_level || data.educationLevel || '',
        skills: professionalProfile.skills || data.skills || '',
        bio: professionalProfile.biography || data.bio || '',
        experiences: (data.experiences && Array.isArray(data.experiences)) ? data.experiences : []
      });

      // Set existing files from professional_profile
      setFiles({
        photo: professionalProfile.profile_photo_url || data.photoUrl || data.photo || null,
        cv: professionalProfile.cv_url || data.cvUrl || data.cv || null,
        legal: professionalProfile.legal_documents || data.legalDocs || []
      });

    } catch (err) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // BLOQUER la soumission si elle n'a pas été explicitement autorisée
    if (!canSubmit) {
      return;
    }
    
    // Ne pas soumettre si on upload encore
    if (uploading) {
      setError("Veuillez attendre la fin de l'upload avant de soumettre");
      return;
    }
    
    // Ne permettre la soumission qu'à l'étape 3
    if (currentStep !== 3) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Basic validation if needed, or rely on backend
      if (!formData.first_name || !formData.last_name) {
        setError("Veuillez remplir votre nom et prénom");
        setCurrentStep(1); // Switch to step 1
        return;
      }

      if (!formData.profession) {
        setError("Veuillez renseigner votre profession");
        setCurrentStep(2); // Switch to step 2
        return;
      }

      if (!formData.secteur && !formData.sector) {
        setError("Veuillez renseigner votre secteur d'activité");
        setCurrentStep(2); // Switch to step 2
        return;
      }

      // Map frontend fields to backend expected fields (seulement les champs de la table users)
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        profession: formData.profession || formData.category || '',
        secteur: formData.secteur || formData.sector || '',
      };

      // Sauvegarder le profil utilisateur (table users)
      await profileService.updateProfile(profileData);
      
      // Sauvegarder les données professionnelles (table professional_profiles)
      const skillsArray = formData.skills 
        ? (Array.isArray(formData.skills) ? formData.skills : formData.skills.split(',').map(s => s.trim()).filter(s => s))
        : ['Compétence à définir'];
      
      // Valider et limiter la biographie
      let bio = formData.bio || '';
      if (bio.length < 50) {
        bio = bio + ' Profil professionnel en cours de rédaction.'.padEnd(50 - bio.length, '.');
      }
      if (bio.length > 2000) {
        bio = bio.substring(0, 2000);
      }
      
      // Valider education_level
      const validEducationLevels = ['bac', 'licence', 'master', 'doctorat', 'ingenieur', 'autre'];
      const educationLevel = validEducationLevels.includes(formData.education_level) 
        ? formData.education_level 
        : 'bac';
      
      const professionalData = {
        category_id: getCategoryBackendId(formData.category) || 1,
        sector_id: getSectorIdByName(formData.secteur || formData.sector) || 1,
        biography: bio,
        years_experience: formData.experiences?.length || 0,
        current_position: formData.profession || 'Poste à définir',
        company_name: formData.experiences?.[0]?.company || '',
        education_level: educationLevel,
        skills: skillsArray,
        is_public: true,
      };
      
      // Appeler l'endpoint pour créer/mettre à jour le professional_profile
      try {
        await professionalService.saveProfessionalProfile(professionalData);
      } catch (profError) {
        // Afficher l'erreur à l'utilisateur
        const validationErrors = profError.response?.data?.errors;
        if (validationErrors) {
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          setError(`Erreur de validation du profil professionnel:\n${errorMessages}`);
          setLoading(false);
          return;
        }
      }
      
      setSuccess('Profil mis à jour avec succès. Vous pouvez maintenant le soumettre pour validation depuis votre tableau de bord.');
      // Rediriger après 3 secondes pour laisser le temps de lire le message
      setTimeout(() => navigate('/usager/dashboard'), 3000);
    } catch (err) {
      console.error('Erreur mise à jour profil:', err.response?.data);
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        const errorMessages = Object.values(backendErrors).flat().join(', ');
        setError(`Erreur de validation : ${errorMessages}`);
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      }
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = async (event, type) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    
    setUploading(true);
    setError(null);

    try {
      // Préparer les données additionnelles (category_id et sector_id)
      const additionalData = {};
      
      // Récupérer category_id depuis formData.category (convertir le slug en ID backend)
      if (formData.category) {
        const categoryBackendId = getCategoryBackendId(formData.category);
        if (categoryBackendId) {
          additionalData.category_id = categoryBackendId;
        }
      }
      
      // Pour sector_id, chercher l'ID correspondant au nom du secteur
      if (formData.secteur || formData.sector) {
        const sectorName = formData.secteur || formData.sector;
        const sectorId = getSectorIdByName(sectorName);
        if (sectorId) {
          additionalData.sector_id = sectorId;
        }
      }

      // Loop through all selected files
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const response = await profileService.uploadFile(file, type, additionalData);
        const fileUrl = response?.url || URL.createObjectURL(file);

        setFiles(prev => {
          if (type === 'legal') {
            return {
              ...prev,
              legal: [...prev.legal, fileUrl]
            };
          } else {
            return {
              ...prev,
              [type]: fileUrl
            };
          }
        });
      }
      // Ne pas afficher de message de succès ni rediriger après l'upload
      // L'utilisateur doit cliquer sur "Enregistrer" pour finaliser
    } catch (err) {
      console.error("Upload error details:", err);
      const errorMessage = err.response?.data?.message || err.message || "Erreur inconnue";
      setError(`Erreur lors de l'upload: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    // Validate current step before moving to next
    if (currentStep === 1) {
      if (!formData.first_name || !formData.last_name) {
        setError("Veuillez remplir au minimum votre nom et prénom avant de continuer");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.profession || !formData.secteur) {
        setError("Veuillez remplir votre profession et secteur d'activité avant de continuer");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    
    setError(null);
    const nextStep = Math.min(currentStep + 1, 3);
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteFile = async (type, index = null) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce fichier ?")) return;
    try {
      setFiles(prev => {
        if (type === 'legal' && index !== null) {
          const newLegal = [...prev.legal];
          newLegal.splice(index, 1);
          return { ...prev, legal: newLegal };
        }
        return { ...prev, [type]: null };
      });
      setSuccess("Fichier supprimé");
    } catch (err) {
      setError("Erreur suppression");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-cream font-inter">
      {/* Header Section */}
      <div className="bg-navy pt-8 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-b-[40px] shadow-lg mb-16">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange opacity-10 rounded-bl-full transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative max-w-5xl mx-auto flex flex-col items-center z-10 text-center">

          {/* Circular Photo Upload */}
          <div className="relative mb-4 group cursor-pointer">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white relative">
              {files.photo ? (
                <img
                  src={typeof files.photo === 'string' ? files.photo : URL.createObjectURL(files.photo)}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <FiUser className="text-5xl" />
                </div>
              )}
              {/* Hover Overlay */}
              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FiCamera className="text-white text-2xl mb-1" />
                <span className="text-white text-xs font-medium center">Modifier</span>
                <input
                  type="file"
                  name="photo"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileUpload(e, 'photo')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-poppins font-title-bold text-white mb-2">
            Mon Profil
          </h1>
          <p className="text-blue-100">
            Complétez vos informations pour une meilleure visibilité.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-20 -mt-20">
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {error && (
            <div className="p-4">
              <Alert type="error" message={error} onClose={() => setError(null)} />
            </div>
          )}
          {success && (
            <div className="p-4">
              <Alert type="success" message={success} onClose={() => setSuccess(null)} />
            </div>
          )}

          {/* Step Indicator */}
          <div className="border-b border-gray-100 px-4 md:px-8 py-6 bg-white">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <StepIndicator step={1} currentStep={currentStep} label="Infos Personnelles" />
                <div className="flex-1 h-0.5 bg-gray-200 mx-4">
                  <div className={`h-full transition-all duration-300 ${currentStep > 1 ? 'bg-green-600 w-full' : 'bg-gray-200 w-0'}`}></div>
                </div>
                <StepIndicator step={2} currentStep={currentStep} label="Infos Professionnelles" />
                <div className="flex-1 h-0.5 bg-gray-200 mx-4">
                  <div className={`h-full transition-all duration-300 ${currentStep > 2 ? 'bg-green-600 w-full' : 'bg-gray-200 w-0'}`}></div>
                </div>
                <StepIndicator step={3} currentStep={currentStep} label="Documents" />
              </div>
            </div>
          </div>

          <form 
            onSubmit={onSubmit} 
            onKeyDown={(e) => {
              // Bloquer Enter sur tout le formulaire sauf dans les textareas
              if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
              }
            }}
            className="p-4 md:p-8 space-y-6" 
            noValidate
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      Informations Personnelles
                    </h2>
                    <p className="text-sm text-gray-500">
                      Remplissez vos informations de base
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="label-form">
                        Nom <span className="text-error-red">*</span>
                      </label>

                      {/* Form Inputs */}
                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Prénom *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name || ''}
                            onChange={handleChange}
                            className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                            placeholder="Votre prénom"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Nom *</label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                          placeholder="Votre nom"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Date de naissance *</label>
                        <div className="relative">
                          <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date || ''}
                            onChange={handleChange}
                            className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Genre *</label>
                        <select
                          name="gender"
                          value={formData.gender || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                        >
                          <option value="">Sélectionner</option>
                          <option value="male">Homme</option>
                          <option value="female">Femme</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Téléphone *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                            placeholder="+33 6 12 34 56 78"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-text-medium text-navy ml-1">Adresse *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMapPin className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                            placeholder="Votre adresse complète"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Ville *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                          placeholder="Votre ville"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Pays *</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                          placeholder="Votre pays"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="professional"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      Informations Professionnelles
                    </h2>
                    <p className="text-sm text-gray-500">
                      Complétez votre profil professionnel
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="label-form">Catégorie Professionnelle</label>
                        <select
                          name="category"
                          value={formData.category || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                        >
                          <option value="">Sélectionner</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Profession *</label>
                        <input
                          type="text"
                          name="profession"
                          value={formData.profession || formData.category || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                          placeholder="Ex: Développeur, Médecin, Architecte..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Secteur d'activité *</label>
                        <select
                          name="secteur"
                          value={formData.secteur || formData.sector || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                        >
                          <option value="">Sélectionner un secteur</option>
                          {SECTORS.map(sector => (
                            <option key={sector.id} value={sector.name}>{sector.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Niveau d'études *</label>
                        <select
                          name="education_level"
                          value={formData.education_level || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                        >
                          <option value="">Sélectionner</option>
                          {EDUCATION_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-full space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Compétences clés</label>
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills || ''}
                          onChange={handleChange}
                          placeholder="Séparez vos compétences par des virgules (ex: Gestion de projet, Excel, Anglais)"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                        />
                        <p className="text-xs text-gray-400 ml-1">Listez vos 5 compétences principales</p>
                      </div>

                      <div className="col-span-full space-y-1">
                        <label className="text-sm font-text-medium text-navy ml-1">Biographie Professionnelle</label>
                        <textarea
                          name="bio"
                          value={formData.bio || ''}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition bg-cream/50"
                          placeholder="Décrivez votre parcours, vos objectifs et ce que vous pouvez apporter..."
                        />
                      </div>

                      {/* Experiences Section */}
                      <div className="col-span-full mt-6">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                          <h3 className="text-lg font-poppins font-title text-navy">Expériences Professionnelles</h3>
                          <button
                            type="button"
                            onClick={addExperience}
                            className="flex items-center gap-1 text-sm text-orange font-medium hover:text-orange-dark transition"
                          >
                            <FiPlus /> Ajouter
                          </button>
                        </div>

                        <div className="space-y-6">
                          {formData.experiences.map((experience, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                              <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                                title="Supprimer"
                              >
                                <FiTrash2 />
                              </button>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-600">Poste</label>
                                  <input
                                    type="text"
                                    name="title"
                                    value={experience.title || ''}
                                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                    placeholder="Ex: Chef de projet"
                                    className="w-full px-3 py-2 rounded border border-gray-200 focus:border-orange text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-600">Entreprise</label>
                                  <input
                                    type="text"
                                    name="company"
                                    value={experience.company || ''}
                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                    placeholder="Ex: Google"
                                    className="w-full px-3 py-2 rounded border border-gray-200 focus:border-orange text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-600">Date de début</label>
                                  <input
                                    type="date"
                                    name="start_date"
                                    value={experience.start_date || ''}
                                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-gray-200 focus:border-orange text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-600">Date de fin (laisser vide si en poste)</label>
                                  <input
                                    type="date"
                                    name="end_date"
                                    value={experience.end_date || ''}
                                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-gray-200 focus:border-orange text-sm"
                                  />
                                </div>
                                <div className="col-span-full space-y-1">
                                  <label className="text-xs font-semibold text-gray-600">Description</label>
                                  <textarea
                                    name="description"
                                    value={experience.description || ''}
                                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                    rows={2}
                                    placeholder="Descriptif des missions..."
                                    className="w-full px-3 py-2 rounded border border-gray-200 focus:border-orange text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          {formData.experiences.length === 0 && (
                            <p className="text-sm text-center text-gray-400 italic py-4">Aucune expérience ajoutée</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="documents"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="col-span-full mb-4">
                      <h2 className="text-lg font-poppins font-title text-navy border-b border-gray-100 pb-2">
                        Vos Documents
                      </h2>
                      <p className="text-sm text-gray-500 mt-2">
                        Importez vos CV et documents légaux. Ils apparaîtront dans la liste ci-dessous.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* CV Upload Card */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-cream/30 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-text-medium text-navy">Curriculum Vitae</h3>
                            <p className="text-xs text-gray-500">PDF, DOCX (max 10 Mo)</p>
                          </div>
                          <FiFileText className="text-2xl text-navy" />
                        </div>
                        <label className="cursor-pointer block">
                          <span className="sr-only">Choisir un CV</span>
                          <input
                            type="file"
                            name="cv"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => { e.stopPropagation(); handleFileUpload(e, 'cv'); }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy/10 file:text-navy hover:file:bg-navy/20 transition"
                          />
                        </label>
                      </div>

                      {/* Legal Docs Upload Card */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-cream/30 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-text-medium text-navy">Documents Légaux</h3>
                            <p className="text-xs text-gray-500">Kbis, Certificats, etc. (PDF)</p>
                          </div>
                          <FiBriefcase className="text-2xl text-gray-600" />
                        </div>
                        <label className="cursor-pointer block">
                          <span className="sr-only">Choisir un document</span>
                          <input
                            type="file"
                            name="legal_docs[]"
                            multiple
                            accept=".pdf"
                            onChange={(e) => { e.stopPropagation(); handleFileUpload(e, 'legal'); }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Vertical List of Uploaded Documents */}
                    <div className="col-span-full mt-8 border-t border-gray-100 pt-8">
                      <h3 className="text-md font-text-medium text-navy mb-4">Documents importés</h3>
                      <div className="space-y-3">
                        {files.cv && (
                          <DocumentListItem type="cv" file={files.cv} onDelete={() => handleDeleteFile('cv')} />
                        )}
                        {/* Map other legal docs here if array */}
                        {files.legal.map((doc, idx) => (
                          <DocumentListItem
                            key={idx}
                            index={idx}
                            type="legal"
                            file={doc.url || doc}
                            onDelete={() => handleDeleteFile('legal', idx)}
                          />
                        ))}
                        {/* Add Placeholder if empty */}
                        {!files.cv && files.legal.length === 0 && (
                          <p className="text-sm text-center text-gray-400 italic">Aucun document téléchargé pour le moment.</p>
                        )}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            {/* Footer / Navigation Buttons */}
            <div className="px-6 md:px-10 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center rounded-b-card">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
                  >
                    ← Précédent
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/usager/dashboard')}
                  className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
                >
                  Annuler
                </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 rounded-full bg-orange text-white font-medium shadow-md hover:bg-orange-dark hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    Suivant →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCanSubmit(true);
                      // Soumettre le formulaire après un court délai
                      setTimeout(() => {
                        const form = e.target.closest('form');
                        if (form) form.requestSubmit();
                      }, 0);
                    }}
                    disabled={loading || uploading}
                    className="px-8 py-3 rounded-full bg-orange text-white font-medium shadow-md hover:bg-orange-dark hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all transform hover:-translate-y-0.5"
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfil;
