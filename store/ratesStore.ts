import { create } from 'zustand';
import type { LiveRates } from '../types/rates';

interface RatesStore {
  rates: LiveRates | null;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;

  setRates: (rates: LiveRates) => void;
  setLoading: (loading: boolean) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRatesStore = create<RatesStore>((set) => ({
  rates: null,
  isLoading: true,
  isConnected: false,
  error: null,

  setRates: (rates) =>
    set({ rates, isLoading: false, error: null }),

  setLoading: (loading) => set({ isLoading: loading }),

  setConnected: (connected) => set({ isConnected: connected }),

  setError: (error) => set({ error, isLoading: false }),
}));
