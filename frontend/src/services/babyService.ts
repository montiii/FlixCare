import api from './api';
import { Baby } from '../types';

export const babyService = {
  getAll: async (): Promise<Baby[]> => {
    const response = await api.get('/babies');
    return response.data;
  },

  getById: async (id: number): Promise<Baby> => {
    const response = await api.get(`/babies/${id}`);
    return response.data;
  },

  create: async (baby: Baby): Promise<Baby> => {
    const response = await api.post('/babies', baby);
    return response.data;
  },

  update: async (id: number, baby: Baby): Promise<Baby> => {
    const response = await api.put(`/babies/${id}`, baby);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/babies/${id}`);
  },
};
