import { create } from 'zustand';
import type { Patient, PatientSummary, TodaysPlan } from '../types';

interface PatientState {
  currentPatient: Patient | null;
  patientSummary: PatientSummary | null;
  todaysPlan: TodaysPlan | null;
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
}

interface PatientActions {
  setCurrentPatient: (patient: Patient) => void;
  setPatientSummary: (summary: PatientSummary) => void;
  setTodaysPlan: (plan: TodaysPlan) => void;
  setPatients: (patients: Patient[]) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  clearError: () => void;
}

export const usePatientStore = create<PatientState & PatientActions>()((set) => ({
  currentPatient: null,
  patientSummary: null,
  todaysPlan: null,
  patients: [],
  isLoading: false,
  error: null,

  setCurrentPatient: (patient) => set({ currentPatient: patient }),
  setPatientSummary: (summary) => set({ patientSummary: summary }),
  setTodaysPlan: (plan) => set({ todaysPlan: plan }),
  setPatients: (patients) => set({ patients }),
  updatePatient: (id, updates) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      currentPatient: state.currentPatient?.id === id ? { ...state.currentPatient, ...updates } : state.currentPatient,
    })),
  clearError: () => set({ error: null }),
}));
