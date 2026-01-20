import api from './api';

export const eventsService = {
  discoverEvents: async (params) => {
    const response = await api.get('/events/discover', { params });
    return response.data;
  },

  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  saveEvent: async (event) => {
    const response = await api.post('/events/save', { event });
    return response.data;
  },

  getSavedEvents: async (params = {}) => {
    const response = await api.get('/events/saved', { params });
    return response.data;
  },
};
