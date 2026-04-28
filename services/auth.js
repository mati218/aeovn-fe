import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  verifyOTP: async (data) => {
    const response = await api.post('/api/auth/verify-otp', data);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getUserStatus: async () => {
    const response = await api.get('/api/auth/status/admin');
    return response.data;
  },
};
