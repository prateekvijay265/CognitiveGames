import React, { useEffect } from 'react';
import { useAppDataStore } from '../store/appDataStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { Loader2 } from 'lucide-react';

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { isLoaded, isLoading, setAppData, setLoading, setError } = useAppDataStore();

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!user) return;
      setLoading(true);

      try {
        let patientsData = [];
        let gameSessionsData = [];
        let remindersData = [];
        let alertsData = [];
        let routinesData = [];
        let memoryBookData = [];

        if (user.role === 'patient') {
          // Patients fetch their own detailed profile using 'me' alias
          const [patientRes, sessionsRes, remindersRes] = await Promise.all([
            api.get(`/patients/me`).catch(() => ({ data: { data: { id: user.id, name: user.name, emergencyContact: {} } } })),
            api.get('/game-sessions').catch(() => ({ data: { data: [] } })),
            api.get('/reminders').catch(() => ({ data: { data: [] } }))
          ]);
          
          if (patientRes.data?.data) {
            patientsData = [patientRes.data.data];
            routinesData = patientRes.data.data.routineItems || [];
            memoryBookData = patientRes.data.data.memoryBookEntries || [];
            alertsData = patientRes.data.data.alerts || [];
          } else {
            patientsData = [{ id: user.id, name: user.name, emergencyContact: {} } as any];
          }
          gameSessionsData = sessionsRes.data?.data || [];
          remindersData = remindersRes.data?.data || [];
        } else {
          // Caregivers, Doctors, Admins fetch list of patients
          const [patientsRes, sessionsRes, alertsRes] = await Promise.all([
            api.get('/patients'),
            api.get('/game-sessions'),
            api.get('/alerts')
          ]);
          
          patientsData = patientsRes.data.data || [];
          gameSessionsData = sessionsRes.data.data || [];
          alertsData = alertsRes.data.data || [];
        }

        if (mounted) {
          setAppData({
            patients: patientsData,
            gameSessions: gameSessionsData,
            reminders: remindersData,
            alerts: alertsData,
            routines: routinesData,
            memoryBook: memoryBookData,
            users: [user as any] // Populate with at least current user
          });
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.response?.data?.message || err.message);
        }
      }
    }

    loadData();

    return () => { mounted = false; };
  }, [user]);

  if (!user) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-stone-500 font-medium animate-pulse">Loading securely from servers...</p>
      </div>
    );
  }

  return <>{children}</>;
}
