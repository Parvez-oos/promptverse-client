import api from '@/lib/api';

export const reportService = {
  create: async (promptId: string, data: { reason: string; description?: string }) => {
    const response = await api.post(`/reports/${promptId}`, data);
    return response.data;
  },

  getAll: async (params?: Record<string, string>) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/reports/${id}`, { status });
    return response.data;
  },
};
