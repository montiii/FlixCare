import api from './api';
import { CleaningRecord } from '../types';

export const cleaningRecordService = {
  getAll: async (): Promise<CleaningRecord[]> => {
    const response = await api.get('/cleaning-records');
    return response.data;
  },

  getByBabyId: async (babyId: number): Promise<CleaningRecord[]> => {
    const response = await api.get(`/cleaning-records/baby/${babyId}`);
    return response.data;
  },

  getByBabyIdAndDateRange: async (
    babyId: number,
    start: string,
    end: string
  ): Promise<CleaningRecord[]> => {
    const response = await api.get(`/cleaning-records/baby/${babyId}/range`, {
      params: { start, end },
    });
    return response.data;
  },

  getById: async (id: number): Promise<CleaningRecord> => {
    const response = await api.get(`/cleaning-records/${id}`);
    return response.data;
  },

  create: async (record: CleaningRecord): Promise<CleaningRecord> => {
    const response = await api.post('/cleaning-records', record);
    return response.data;
  },

  update: async (id: number, record: CleaningRecord): Promise<CleaningRecord> => {
    const response = await api.put(`/cleaning-records/${id}`, record);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/cleaning-records/${id}`);
  },
};
