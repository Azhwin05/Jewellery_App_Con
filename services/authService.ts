import { api } from './api';
import type { User, JewelryPreference } from '../types/user';

// In development, mock all calls so the app runs without a backend.
const IS_DEV = __DEV__;

function mockUser(email: string): User {
  return {
    id: 'mock-user-1',
    email,
    fullName: 'Demo User',
    preferences: ['Gold'],
    isProfileComplete: false,
    createdAt: new Date().toISOString(),
  };
}

export const authService = {
  async sendOtp(email: string): Promise<void> {
    if (IS_DEV) {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 800));
      return;
    }
    await api.post('/auth/send-otp', { email });
  },

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ user: User; token: string }> {
    if (IS_DEV) {
      await new Promise((r) => setTimeout(r, 800));
      if (otp === '000000') {
        throw new Error('Invalid OTP');
      }
      return { user: mockUser(email), token: 'mock-jwt-token' };
    }
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    return data;
  },

  async updateProfile(payload: {
    fullName?: string;
    phone?: string;
    preferences?: JewelryPreference[];
  }): Promise<User> {
    if (IS_DEV) {
      await new Promise((r) => setTimeout(r, 500));
      return mockUser('');
    }
    const { data } = await api.put('/auth/profile', payload);
    return data;
  },

  async logout(): Promise<void> {
    if (IS_DEV) return;
    await api.post('/auth/logout');
  },
};
