import api from '@/lib/api';

export const paymentService = {
  createIntent: async () => {
    const response = await api.post('/payments/create-intent');
    return response.data;
  },

  confirm: async (paymentIntentId: string) => {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  },

  getAll: async (params?: Record<string, string>) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get('/payments/my-payments');
    return response.data;
  },
};
