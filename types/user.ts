export type JewelryPreference = 'Gold' | 'Silver' | 'Diamond' | 'Platinum';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  preferences: JewelryPreference[];
  isProfileComplete: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
