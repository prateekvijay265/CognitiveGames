import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './lib/i18n';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import { syncEngine } from './services/sync';

// Lazy-loaded pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));

// Patient
const PatientOnboarding = React.lazy(() => import('./pages/patient/PatientOnboarding'));
const PatientHome = React.lazy(() => import('./pages/patient/PatientHome'));
const PatientGames = React.lazy(() => import('./pages/patient/PatientGames'));
const PatientReminders = React.lazy(() => import('./pages/patient/PatientReminders'));
const PatientProgress = React.lazy(() => import('./pages/patient/PatientProgress'));
const PatientHelp = React.lazy(() => import('./pages/patient/PatientHelp'));
const PatientRoutine = React.lazy(() => import('./pages/patient/PatientRoutine'));
const PatientMemoryBook = React.lazy(() => import('./pages/patient/PatientMemoryBook'));
const GamePlayer = React.lazy(() => import('./pages/patient/GamePlayer'));

// Caregiver
const CaregiverDashboard = React.lazy(() => import('./pages/caregiver/CaregiverDashboard'));
const CaregiverPatients = React.lazy(() => import('./pages/caregiver/CaregiverPatients'));
const CaregiverPatientDetail = React.lazy(() => import('./pages/caregiver/CaregiverPatientDetail'));
const CaregiverReminders = React.lazy(() => import('./pages/caregiver/CaregiverReminders'));
const CaregiverReports = React.lazy(() => import('./pages/caregiver/CaregiverReports'));
const CaregiverAlerts = React.lazy(() => import('./pages/caregiver/CaregiverAlerts'));
const CaregiverSettings = React.lazy(() => import('./pages/caregiver/CaregiverSettings'));

// Doctor
const DoctorDashboard = React.lazy(() => import('./pages/doctor/DoctorDashboard'));
const DoctorPatients = React.lazy(() => import('./pages/doctor/DoctorPatients'));
const DoctorPatientProfile = React.lazy(() => import('./pages/doctor/DoctorPatientProfile'));
const DoctorReports = React.lazy(() => import('./pages/doctor/DoctorReports'));

// Admin
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminContent = React.lazy(() => import('./pages/admin/AdminContent'));
const AdminAudit = React.lazy(() => import('./pages/admin/AdminAudit'));

// Layouts
const PatientLayout = React.lazy(() => import('./layouts/PatientLayout'));
const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center animate-pulse">
          <span className="text-3xl">🧠</span>
        </div>
        <div className="text-stone-500 text-lg">Loading Smriti Care...</div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard
    const roleRoutes: Record<string, string> = {
      patient: '/patient',
      caregiver: '/caregiver',
      doctor: '/doctor',
      admin: '/admin',
    };
    return <Navigate to={roleRoutes[user.role] ?? '/login'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, isAuthenticated } = useAuthStore();
  const { onboardingComplete } = useUIStore();

  // Auto-redirect to role dashboard when logged in
  function getDefaultRoute() {
    if (!isAuthenticated || !user) return '/login';
    const routes: Record<string, string> = {
      patient: onboardingComplete ? '/patient' : '/patient/onboarding',
      caregiver: '/caregiver',
      doctor: '/doctor',
      admin: '/admin',
    };
    return routes[user.role] ?? '/login';
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Patient */}
      <Route path="/patient/onboarding" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientOnboarding />
        </ProtectedRoute>
      } />
      <Route path="/patient" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientLayout />
        </ProtectedRoute>
      }>
        <Route index element={<PatientHome />} />
        <Route path="games" element={<PatientGames />} />
        <Route path="reminders" element={<PatientReminders />} />
        <Route path="progress" element={<PatientProgress />} />
        <Route path="help" element={<PatientHelp />} />
        <Route path="routine" element={<PatientRoutine />} />
        <Route path="memory-book" element={<PatientMemoryBook />} />
      </Route>
      <Route path="/patient/game/:gameId" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <GamePlayer />
        </ProtectedRoute>
      } />

      {/* Caregiver */}
      <Route path="/caregiver" element={
        <ProtectedRoute allowedRoles={['caregiver']}>
          <DashboardLayout role="caregiver" />
        </ProtectedRoute>
      }>
        <Route index element={<CaregiverDashboard />} />
        <Route path="patients" element={<CaregiverPatients />} />
        <Route path="patients/:patientId" element={<CaregiverPatientDetail />} />
        <Route path="reminders" element={<CaregiverReminders />} />
        <Route path="reports" element={<CaregiverReports />} />
        <Route path="alerts" element={<CaregiverAlerts />} />
        <Route path="settings" element={<CaregiverSettings />} />
      </Route>

      {/* Doctor */}
      <Route path="/doctor" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <DashboardLayout role="doctor" />
        </ProtectedRoute>
      }>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="patients/:patientId" element={<DoctorPatientProfile />} />
        <Route path="reports" element={<DoctorReports />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout role="admin" />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="audit" element={<AdminAudit />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import DataProvider from './components/DataProvider';

export default function App() {
  const { fontSize, highContrast, reducedMotion } = useUIStore();

  // Apply accessibility settings to root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-size', fontSize);
    root.setAttribute('data-high-contrast', String(highContrast));
    if (reducedMotion) {
      root.style.setProperty('--motion-duration', '0.01ms');
    } else {
      root.style.removeProperty('--motion-duration');
    }
  }, [fontSize, highContrast, reducedMotion]);

  // Start sync engine
  useEffect(() => {
    const stopSync = syncEngine.startPeriodicSync(30000);
    return stopSync;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <React.Suspense fallback={<LoadingFallback />}>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </React.Suspense>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { borderRadius: '12px', fontFamily: 'inherit' },
            duration: 4000,
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
