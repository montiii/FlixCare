import api from './api';
import { TemperatureRecord } from '../types';

export const temperatureRecordService = {
  getAll: async (): Promise<TemperatureRecord[]> => {
    const response = await api.get('/temperature-records');
    return response.data;
  },

  getByBabyId: async (babyId: number): Promise<TemperatureRecord[]> => {
    const response = await api.get(`/temperature-records/baby/${babyId}`);
    return response.data;
  },

  getByBabyIdAndDateRange: async (
    babyId: number,
    start: string,
    end: string
  ): Promise<TemperatureRecord[]> => {
    const response = await api.get(`/temperature-records/baby/${babyId}/range`, {
      params: { start, end },
    });
    return response.data;
  },

  getById: async (id: number): Promise<TemperatureRecord> => {
    const response = await api.get(`/temperature-records/${id}`);
    return response.data;
  },

  create: async (record: TemperatureRecord): Promise<TemperatureRecord> => {
    const response = await api.post('/temperature-records', record);
    return response.data;
  },

  update: async (id: number, record: TemperatureRecord): Promise<TemperatureRecord> => {
    const response = await api.put(`/temperature-records/${id}`, record);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/temperature-records/${id}`);
  },
};
