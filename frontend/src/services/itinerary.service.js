import api from './api';

export const itineraryService = {
  generateItinerary: async (data) => {
    const response = await api.post('/itineraries/generate', data);
    return response.data;
  },

  getItineraries: async (params = {}) => {
    const response = await api.get('/itineraries', { params });
    return response.data;
  },

  getItineraryById: async (id) => {
    const response = await api.get(`/itineraries/${id}`);
    return response.data;
  },

  deleteItinerary: async (id) => {
    const response = await api.delete(`/itineraries/${id}`);
    return response.data;
  },
};
