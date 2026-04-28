import api from './api';

export const usersService = {
  getAllUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },

  updateUserStatus: async ({ id, status }) => {
    const response = await api.patch(`/api/admin/users/${id}/status`, { status });
    return response.data;
  },

  updateUserIP: async ({ id, newIP }) => {
    const response = await api.patch(`/api/admin/users/${id}/ip`, { newIP });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },
};
