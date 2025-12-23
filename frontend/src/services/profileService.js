import api from './api';

const profileService = {
  // Créer un profil
  createProfile: async (profileData) => {
    const response = await api.post('/profiles', profileData);
    return response.data;
  },

  // Mettre à jour un profil
  updateProfile: async (id, profileData) => {
    const response = await api.put(`/profiles/${id}`, profileData);
    return response.data;
  },

  // Obtenir son profil
  getMyProfile: async () => {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  // Obtenir un profil public
  getProfile: async (id) => {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  },

  // Upload de fichier
  uploadFile: async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // 'photo', 'cv', 'document'
    
    const response = await api.post('/profiles/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer un fichier
  deleteFile: async (fileId) => {
    const response = await api.delete(`/profiles/files/${fileId}`);
    return response.data;
  },
};

export default profileService;
