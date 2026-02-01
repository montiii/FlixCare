import api from './api';
import { FeedingRecord } from '../types';

export const feedingRecordService = {
  getAll: async (): Promise<FeedingRecord[]> => {
    const response = await api.get('/feeding-records');
    return response.data;
  },

  getByBabyId: async (babyId: number): Promise<FeedingRecord[]> => {
    const response = await api.get(`/feeding-records/baby/${babyId}`);
    return response.data;
  },

  getByBabyIdAndDateRange: async (
    babyId: number,
    start: string,
    end: string
  ): Promise<FeedingRecord[]> => {
    const response = await api.get(`/feeding-records/baby/${babyId}/range`, {
      params: { start, end },
    });
    return response.data;
  },

  getById: async (id: number): Promise<FeedingRecord> => {
    const response = await api.get(`/feeding-records/${id}`);
    return response.data;
  },

  create: async (record: FeedingRecord): Promise<FeedingRecord> => {
    const response = await api.post('/feeding-records', record);
    return response.data;
  },

  update: async (id: number, record: FeedingRecord): Promise<FeedingRecord> => {
    const response = await api.put(`/feeding-records/${id}`, record);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/feeding-records/${id}`);
  },
};
