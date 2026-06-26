import api from '@/lib/api';

export const userService = {
  getAll: async (params?: Record<string, string>) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: { name?: string; photoURL?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  getTopCreators: async () => {
    const response = await api.get('/users/top-creators');
    return response.data;
  },

  updateRole: async (userId: string, role: string) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  delete: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};
