import { create } from 'zustand';
import type { User } from '../types/user';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;

  setUser: (user: User, token: string) => void;
  setPendingEmail: (email: string) => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (partial: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  pendingEmail: null,

  setUser: (user, token) =>
    set({ user, token, isAuthenticated: true, isLoading: false }),

  setPendingEmail: (email) => set({ pendingEmail: email }),

  setLoading: (loading) => set({ isLoading: loading }),

  updateProfile: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    })),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      pendingEmail: null,
    }),
}));
