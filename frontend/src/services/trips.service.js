import api from './api';

export const tripsService = {
  getTrips: async () => {
    const response = await api.get('/trips');
    return response.data;
  },

  getTripById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  createTrip: async (trip) => {
    const response = await api.post('/trips', trip);
    return response.data;
  },

  updateTrip: async (id, trip) => {
    const response = await api.put(`/trips/${id}`, trip);
    return response.data;
  },

  deleteTrip: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },

  getTripRecommendations: async (id) => {
    const response = await api.get(`/trips/${id}/recommendations`);
    return response.data;
  },
};
