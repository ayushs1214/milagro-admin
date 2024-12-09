import { create } from 'zustand';
import { auth } from '../lib/auth';
import { session } from '../lib/session';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await auth.signIn(email, password);
      if (error) throw error;

      if (!data.user) {
        throw new Error('Login failed - no user data received');
      }

      // Get user profile
      const { data: profile, error: profileError } = await session.getCurrentUser();
      if (profileError) throw profileError;

      if (!profile) {
        throw new Error('User profile not found');
      }

      set({ 
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during login'
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await auth.signOut();
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during logout'
      });
      throw error;
    }
  },

  updateUser: (userData) => set((state) => ({
    user: state.user ? { ...state.user, ...userData } : null
  })),

  clearError: () => set({ error: null })
}));