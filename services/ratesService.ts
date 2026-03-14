import { api } from './api';
import type { LiveRates } from '../types/rates';

export const ratesService = {
  async getCurrentRates(): Promise<LiveRates> {
    const { data } = await api.get('/rates/current');
    return data;
  },
};
