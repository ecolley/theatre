import api from './api';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (profile, notes) => {
    const response = await api.put('/profile', { profile, notes });
    return response.data;
  },
};
