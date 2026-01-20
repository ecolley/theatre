import api from './api';

export const authService = {
  login: async (password) => {
    const response = await api.post('/auth/login', { password });
    if (response.data.success && response.data.token) {
      localStorage.setItem('theatre_token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('theatre_token');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('theatre_token');
  },

  verify: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data.success;
    } catch (error) {
      return false;
    }
  },
};
