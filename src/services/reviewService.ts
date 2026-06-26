import api from '@/lib/api';

export const reviewService = {
  getPromptReviews: async (promptId: string) => {
    const response = await api.get(`/reviews/prompt/${promptId}`);
    return response.data;
  },

  create: async (promptId: string, data: { rating: number; comment: string }) => {
    const response = await api.post(`/reviews/${promptId}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  getRecentReviews: async () => {
    const response = await api.get('/reviews/recent');
    return response.data;
  },

  getMyReviews: async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },
};
