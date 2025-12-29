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
  uploadFile: async (file, type = 'photo') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post('/professional/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default profileService;