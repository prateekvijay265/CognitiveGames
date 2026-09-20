import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotificationStatus } from '../types';

interface UIState {
  sidebarOpen: boolean;
  syncStatus: NotificationStatus;
  isPatientMode: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  theme: 'light' | 'dark';
  activeGame: string | null;
  onboardingComplete: boolean;
}

interface UIActions {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSyncStatus: (status: NotificationStatus) => void;
  setPatientMode: (isPatient: boolean) => void;
  setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
  setHighContrast: (hc: boolean) => void;
  setReducedMotion: (rm: boolean) => void;
  setActiveGame: (gameId: string | null) => void;
  setOnboardingComplete: (done: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      syncStatus: 'online',
      isPatientMode: false,
      reducedMotion: false,
      fontSize: 'large',
      highContrast: false,
      theme: 'light',
      activeGame: null,
      onboardingComplete: false,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSyncStatus: (status) => set({ syncStatus: status }),
      setPatientMode: (isPatient) => set({ isPatientMode: isPatient }),
      setFontSize: (size) => set({ fontSize: size }),
      setHighContrast: (hc) => set({ highContrast: hc }),
      setReducedMotion: (rm) => set({ reducedMotion: rm }),
      setActiveGame: (gameId) => set({ activeGame: gameId }),
      setOnboardingComplete: (done) => set({ onboardingComplete: done }),
    }),
    {
      name: 'smriti-ui',
      partialize: (state) => ({
        fontSize: state.fontSize,
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
