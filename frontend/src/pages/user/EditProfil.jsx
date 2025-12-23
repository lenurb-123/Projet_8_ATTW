import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema } from '../../utils/validators';
import profileService from '../../services/profileService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { CATEGORIES, EDUCATION_LEVELS } from '../../constants/categories';

const EditProfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getMyProfile();
      
      // Remplir le formulaire avec les données existantes
      Object.keys(data).forEach(key => {
        setValue(key, data[key]);
      });
    } catch (err) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setError(null);
      setSuccess(null);
      await profileService.updateProfile(data.id, data);
      setSuccess('Profil mis à jour avec succès');
      setTimeout(() => navigate('/usager/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      await profileService.uploadFile(file, type);
      setSuccess(`${type} uploadé avec succès`);
    } catch (err) {
      setError(`Erreur lors de l'upload du ${type}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-poppins font-title-bold text-navy mb-8">Modifier mon profil</h1>

        <div className="bg-sand rounded-card shadow-card p-6">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h2 className="text-xl font-poppins font-title-bold text-navy mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-inter font-text-medium text-navy mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className={`w-full px-4 py-2 border rounded-card focus:ring-2 focus:ring-orange bg-cream ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre *
                  </label>
                  <select
                    {...register('gender')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations professionnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    {...register('category')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur d'activité *
                  </label>
                  <input
                    type="text"
                    {...register('sector')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.sector ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.sector && (
                    <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau d'étude *
                  </label>
                  <select
                    {...register('educationLevel')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.educationLevel ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner un niveau</option>
                    {EDUCATION_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                  {errors.educationLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.educationLevel.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biographie
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.bio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Présentez-vous en quelques mots..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => handleFileUpload(e, 'photo')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={uploading}
                  />
                  <p className="text-sm text-gray-500 mt-1">Format: JPG, PNG (max 5 MB)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'cv')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={uploading}
                  />
                  <p className="text-sm text-gray-500 mt-1">Format: PDF, DOC, DOCX (max 10 MB)</p>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6 border-t border-gray-warm">
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="flex-1 bg-orange text-navy py-2 px-4 rounded-card hover:bg-orange-dark disabled:opacity-50 font-inter font-text-medium transition shadow-card"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/usager/dashboard')}
                className="px-6 py-2 border-2 border-gray-warm rounded-card hover:bg-cream font-inter font-text-medium transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfil;
