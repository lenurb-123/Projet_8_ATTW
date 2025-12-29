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
      const data = await adminService.getProfileForValidation(id);

      // FORMATTING / MAPPING DIRECT
      const formattedProfile = {
        id: data.id, // ID du professional_profile
        userId: data.user?.id, // ID de l'utilisateur
        
        firstName: data.user?.first_name,
        lastName: data.user?.last_name,
        email: data.user?.email,
        phone: data.user?.phone,
        birthDate: data.user?.birth_date,
        gender: data.user?.gender,
        address: data.user?.address,
        city: data.user?.city,
        country: data.user?.country,
        
        profession: data.user?.profession,
        sector: data.sector?.name || data.user?.secteur,
        category: data.category?.name,
        biography: data.biography,
        yearsExperience: data.years_experience,
        currentPosition: data.current_position,
        companyName: data.company_name,
        educationLevel: data.education_level,
        skills: data.skills,

        createdAt: data.created_at,
        status: data.approved_at ? 'validated' : (data.rejection_reason ? 'rejected' : 'pending'),
        rejectionReason: data.rejection_reason,

        educations: data.user?.academic_educations || [],
        experiences: data.user?.professional_experiences || [],

        cvUrl: data.cv_url,
        photoUrl: data.profile_photo_url || data.photo_url,
        legalDocuments: data.legal_documents || []
      };

      setProfile(formattedProfile);
    } catch (err) {
      setError('Profil introuvable ou erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!confirm('Êtes-vous sûr de vouloir valider ce profil?')) return;

    try {
      // Utiliser profile.id qui est l'ID du professional_profile, pas l'ID de l'URL
      await adminService.validateProfile(profile.id);
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
      await adminService.rejectProfile(profile.id, rejectReason);
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
      setLoading(true);
      await adminService.rejectProfile(profile.id, modificationComments);

      setSuccess('Demande de modification envoyée (Profil rejeté pour correction)');
      setShowModificationModal(false);
      setTimeout(() => navigate('/admin/profils'), 2000);
    } catch (err) {
      setError('Erreur lors de la demande');
    }finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!profile) return <Alert type="error" message="Profil non trouvé" />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/admin/profils" className="text-orange-600 hover:text-orange-700 mb-6 inline-flex items-center text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Validation du profil</h1>
          <p className="text-sm text-gray-600 mt-1">Examinez les informations et documents</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations du profil */}
          <div className="lg:col-span-2 space-y-6">
            {/* En-tête */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl font-semibold">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{profile.category}</p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                      profile.status === 'validated'
                        ? 'bg-green-100 text-green-800'
                        : profile.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {PROFILE_STATUS_LABELS[profile.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Informations personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                  <p className="text-sm text-gray-900">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date de naissance</p>
                  <p className="text-sm text-gray-900">
                    {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Genre</p>
                  <p className="text-sm text-gray-900">{profile.gender || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Adresse</p>
                  <p className="text-sm text-gray-900">{profile.address || 'N/A'}</p>
                </div>
                {profile.city && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ville</p>
                    <p className="text-sm text-gray-900">{profile.city}</p>
                  </div>
                )}
                {profile.country && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pays</p>
                    <p className="text-sm text-gray-900">{profile.country}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Informations professionnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Profession</p>
                  <p className="text-sm text-gray-900">{profile.profession || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Poste actuel</p>
                  <p className="text-sm text-gray-900">{profile.currentPosition || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Catégorie</p>
                  <p className="text-sm text-gray-900">{profile.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Secteur d'activité</p>
                  <p className="text-sm text-gray-900">{profile.sector || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Niveau d'étude</p>
                  <p className="text-sm text-gray-900">{profile.educationLevel || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Années d'expérience</p>
                  <p className="text-sm text-gray-900">{profile.yearsExperience || 0} an(s)</p>
                </div>
              </div>
              
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Compétences</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(profile.skills) ? profile.skills : JSON.parse(profile.skills || '[]')).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.biography && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Biographie</p>
                  <p className="text-sm text-gray-700">{profile.biography}</p>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Documents</h3>
              <div className="space-y-2">
                {profile.cvUrl && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">CV</span>
                    </div>
                    <a
                      href={profile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Télécharger
                    </a>
                  </div>
                )}
                {profile.photoUrl && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">Photo</span>
                    </div>
                    <a
                      href={profile.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
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
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Actions</h3>
              
              {profile.status === 'pending' && (
                <div className="space-y-2">
                  <button
                    onClick={handleValidate}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center text-sm font-medium transition"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Valider le profil
                  </button>

                  <button
                    onClick={() => setShowModificationModal(true)}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 flex items-center justify-center text-sm font-medium transition"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Demander modification
                  </button>

                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center text-sm font-medium transition"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rejeter le profil
                  </button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Inscrit le</p>
                <p className="text-sm text-gray-900 font-medium">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Rejet */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejeter le profil</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Indiquez la raison du rejet..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-4 text-sm"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm font-medium transition"
                >
                  Confirmer le rejet
                </button>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
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
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demander des modifications</h3>
              <textarea
                value={modificationComments}
                onChange={(e) => setModificationComments(e.target.value)}
                placeholder="Précisez les modifications à apporter..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-4 text-sm"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleRequestModification}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 text-sm font-medium transition"
                >
                  Envoyer la demande
                </button>
                <button
                  onClick={() => setShowModificationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
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
