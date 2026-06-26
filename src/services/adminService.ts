import api from '@/lib/api';

export const adminService = {
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  getAllPrompts: async (params?: Record<string, string>) => {
    const response = await api.get('/admin/prompts', { params });
    return response.data;
  },

  approvePrompt: async (id: string) => {
    const response = await api.patch(`/admin/prompts/${id}/approve`);
    return response.data;
  },

  rejectPrompt: async (id: string, feedback: string) => {
    const response = await api.patch(`/admin/prompts/${id}/reject`, { feedback });
    return response.data;
  },

  toggleFeatured: async (id: string) => {
    const response = await api.patch(`/admin/prompts/${id}/feature`);
    return response.data;
  },
};
