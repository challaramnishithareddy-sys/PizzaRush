import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Global authentication state.
 * Persisted to localStorage so the user stays logged in on refresh.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        localStorage.setItem('pizzahub_token', token);
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('pizzahub_token');
        localStorage.removeItem('pizzahub_user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'pizzahub_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
