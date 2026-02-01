import api from './api';
import { WeightRecord } from '../types';

export const weightRecordService = {
  getAll: async (): Promise<WeightRecord[]> => {
    const response = await api.get('/weight-records');
    return response.data;
  },

  getByBabyId: async (babyId: number): Promise<WeightRecord[]> => {
    const response = await api.get(`/weight-records/baby/${babyId}`);
    return response.data;
  },

  getById: async (id: number): Promise<WeightRecord> => {
    const response = await api.get(`/weight-records/${id}`);
    return response.data;
  },

  create: async (weightRecord: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeightRecord> => {
    const response = await api.post('/weight-records', weightRecord);
    return response.data;
  },

  update: async (id: number, weightRecord: Partial<WeightRecord>): Promise<WeightRecord> => {
    const response = await api.put(`/weight-records/${id}`, weightRecord);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/weight-records/${id}`);
  },
};
