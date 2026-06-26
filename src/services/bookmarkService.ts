import api from '@/lib/api';

export const bookmarkService = {
  toggle: async (promptId: string) => {
    const response = await api.post(`/bookmarks/${promptId}`);
    return response.data;
  },

  getAll: async (params?: Record<string, string>) => {
    const response = await api.get('/bookmarks', { params });
    return response.data;
  },

  isBookmarked: async (promptId: string) => {
    const response = await api.get(`/bookmarks/${promptId}`);
    return response.data;
  },
};
