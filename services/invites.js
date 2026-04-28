import api from './api';

export const invitesService = {
  generateInvite: async (data) => {
    const response = await api.post('/api/invite/generate', data);
    return response.data;
  },

  listInvites: async () => {
    const response = await api.get('/api/invite/list');
    return response.data;
  },
};
