import api from '@/lib/api';

export const authService = {
  register: async (data: { name: string; email: string; password: string; photoURL?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  googleLogin: async (idToken: string) => {
    const response = await api.post('/auth/google-login', { idToken });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};
