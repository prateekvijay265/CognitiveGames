import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  loginWithPin: (patientId: string, pin: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, _get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data.data;
          set({ user, token, isAuthenticated: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : 'Login failed. Please try again.';
          set({ isLoading: false, error: msg, isAuthenticated: false });
          throw error;
        }
      },

      loginWithPin: async (patientId, pin) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/patient-pin', { patientId, pin });
          const { user, token } = response.data.data;
          set({ user, token, isAuthenticated: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : 'PIN login failed.';
          set({ isLoading: false, error: msg, isAuthenticated: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', data);
          const { user, token } = response.data.data;
          set({ user, token, isAuthenticated: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : 'Registration failed.';
          set({ isLoading: false, error: msg });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
        delete api.defaults.headers.common['Authorization'];
      },

      clearError: () => set({ error: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'Neuro Mind-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

