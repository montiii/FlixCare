import api from './api';
import { MedicationRecord } from '../types';

export const medicationRecordService = {
  getAll: async (): Promise<MedicationRecord[]> => {
    const response = await api.get('/medication-records');
    return response.data;
  },

  getByBabyId: async (babyId: number): Promise<MedicationRecord[]> => {
    const response = await api.get(`/medication-records/baby/${babyId}`);
    return response.data;
  },

  getById: async (id: number): Promise<MedicationRecord> => {
    const response = await api.get(`/medication-records/${id}`);
    return response.data;
  },

  create: async (record: Omit<MedicationRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicationRecord> => {
    const response = await api.post('/medication-records', record);
    return response.data;
  },

  update: async (id: number, record: Partial<MedicationRecord>): Promise<MedicationRecord> => {
    const response = await api.put(`/medication-records/${id}`, record);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/medication-records/${id}`);
  },
};
