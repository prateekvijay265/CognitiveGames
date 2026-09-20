import { create } from 'zustand';
import type { Patient, GameSession, Reminder, Alert, DailyRoutineItem, MemoryBookEntry, User, Note, CognitiveMetric } from '@/types';

interface AppDataState {
  patients: Patient[];
  gameSessions: GameSession[];
  reminders: Reminder[];
  alerts: Alert[];
  routines: DailyRoutineItem[];
  memoryBook: MemoryBookEntry[];
  users: User[];
  notes: Note[];
  metrics: CognitiveMetric[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AppDataActions {
  setAppData: (data: Partial<AppDataState>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppDataStore = create<AppDataState & AppDataActions>()((set) => ({
  patients: [],
  gameSessions: [],
  reminders: [],
  alerts: [],
  routines: [],
  memoryBook: [],
  users: [],
  notes: [],
  metrics: [],
  isLoaded: false,
  isLoading: true,
  error: null,
  setAppData: (data) => set((state) => ({ ...state, ...data, isLoaded: true, isLoading: false })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));
