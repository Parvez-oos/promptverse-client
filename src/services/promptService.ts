import api from '@/lib/api';

export const promptService = {
  getAll: async (params?: Record<string, string>) => {
    const response = await api.get('/prompts', { params });
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get('/prompts/featured');
    return response.data;
  },

  getTrending: async () => {
    const response = await api.get('/prompts/trending');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/prompts/${id}`);
    return response.data;
  },

  create: async (data: FormData | Record<string, any>) => {
    const response = await api.post('/prompts', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  update: async (id: string, data: Record<string, any>) => {
    const response = await api.put(`/prompts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/prompts/${id}`);
    return response.data;
  },

  incrementCopy: async (id: string) => {
    const response = await api.patch(`/prompts/${id}/copy`);
    return response.data;
  },

  fork: async (id: string) => {
    const response = await api.post(`/prompts/${id}/fork`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/prompts/categories');
    return response.data;
  },

  getAITools: async () => {
    const response = await api.get('/prompts/ai-tools');
    return response.data;
  },
};

export const aiService = {
  testPrompt: async (content: string, aiTool: string) => {
    const response = await api.post('/ai/test', { content, aiTool });
    return response.data;
  },
};
