import api from '@/lib/api';

export const dashboardService = {
  getUserAnalytics: async () => {
    const response = await api.get('/dashboard/user/analytics');
    return response.data;
  },

  getCreatorAnalytics: async () => {
    const response = await api.get('/dashboard/creator/analytics');
    return response.data;
  },

  getMyPrompts: async (params?: Record<string, string>) => {
    const response = await api.get('/dashboard/creator/prompts', { params });
    return response.data;
  },
};
