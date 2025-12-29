import api from './api';

const profileService = {
  getMyProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/profile');
    return response.data;
  },

  getEducations: async () => {
    const response = await api.get('/profile/education');
    return response.data;
  },

  addEducation: async (educationData) => {
    const response = await api.post('/profile/education', educationData);
    return response.data;
  },

  updateEducation: async (id, educationData) => {
    const response = await api.put(`/profile/education/${id}`, educationData);
    return response.data;
  },

  deleteEducation: async (id) => {
    const response = await api.delete(`/profile/education/${id}`);
    return response.data;
  },

  getExperiences: async () => {
    const response = await api.get('/profile/experience');
    return response.data;
  },

  addExperience: async (experienceData) => {
    const response = await api.post('/profile/experience', experienceData);
    return response.data;
  },

  updateExperience: async (id, experienceData) => {
    const response = await api.put(`/profile/experience/${id}`, experienceData);
    return response.data;
  },

  deleteExperience: async (id) => {
    const response = await api.delete(`/profile/experience/${id}`);
    return response.data;
  },

  subscribeNewsletter: async () => {
    const response = await api.post('/newsletter/subscribe');
    return response.data;
  },

  unsubscribeNewsletter: async () => {
    const response = await api.post('/newsletter/unsubscribe');
    return response.data;
  },

  // Upload de fichiers (photo, CV, documents légaux)
  uploadFile: async (file, type = 'photo', additionalData = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Mapper les types frontend vers les types backend attendus
    const documentTypeMap = {
      'photo': 'profile_photo',
      'cv': 'cv',
      'legal': 'legal_document'
    };
    
    formData.append('document_type', documentTypeMap[type] || type);
    
    // Ajouter category_id et sector_id si fournis
    if (additionalData.category_id) {
      formData.append('category_id', additionalData.category_id);
    }
    if (additionalData.sector_id) {
      formData.append('sector_id', additionalData.sector_id);
    }
    
    const response = await api.post('/professional/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Récupérer un profil public par ID (pour la page ProfilPublic)
  getProfile: async (id) => {
    const response = await api.get(`/directory/${id}`);
    const data = response.data.profile;
    
    // Mapper la structure du backend vers le format attendu par le frontend
    return {
      id: id,
      first_name: data.personal_info?.full_name?.split(' ')[0] || '',
      last_name: data.personal_info?.full_name?.split(' ').slice(1).join(' ') || '',
      email: data.personal_info?.email,
      phone: data.personal_info?.phone,
      city: data.personal_info?.city,
      country: data.personal_info?.country,
      
      category: data.professional_info?.category,
      sector: data.professional_info?.sector,
      bio: data.professional_info?.biography,
      education_level: data.professional_info?.education_level,
      skills: data.professional_info?.skills?.join(', '),
      current_position: data.professional_info?.current_position,
      company_name: data.professional_info?.company_name,
      years_experience: data.professional_info?.years_experience,
      languages: data.professional_info?.languages,
      professional_interests: data.professional_info?.professional_interests,
      
      photoUrl: data.documents?.profile_photo_url,
      cvUrl: data.documents?.cv_url,
      
      experiences: data.professional_experiences || [],
      education: data.academic_educations || []
    };
  }
};

export default profileService;