import { useAppDataStore } from '@/store/appDataStore';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { toast } from 'sonner';


type UserRole = 'patient' | 'caregiver' | 'doctor' | 'admin';

export default function LoginPage() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const { t, i18n } = useTranslation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { setPatientMode } = useUIStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigateByRole = (role: UserRole) => {
    const routes: Record<UserRole, string> = {
      patient: '/patient',
      caregiver: '/caregiver',
      doctor: '/doctor',
      admin: '/admin',
    };
    navigate(routes[role] ?? '/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      const { user } = useAuthStore.getState();
      if (user) {
        setPatientMode(user.role === 'patient');
        navigateByRole(user.role as UserRole);
      }
    } catch {
      // error shown in UI
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col lg:flex-row">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 p-12 items-center justify-center">
        <div className="max-w-md text-white text-center">
          <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-8">
            <Brain size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Smriti Care</h1>
          <p className="text-teal-100 text-xl mb-8 leading-relaxed">
            "Helping memories stay connected."
          </p>
          <p className="text-teal-200 text-sm leading-relaxed">
            AI-assisted cognitive wellness and daily memory support platform for older adults, families, caregivers, and healthcare teams across North-Eastern India.
          </p>

          {/* Decorative features */}
          <div className="mt-12 grid grid-cols-2 gap-4 text-left">
            {['6 Languages', 'Offline-First', '10 Activities', 'Voice Guided'].map((f) => (
              <div key={f} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-teal-300" />
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between w-full mb-8 lg:absolute lg:top-8 lg:right-8 lg:w-auto lg:mb-0">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">S</div>
            <div className="font-bold text-stone-900 text-xl">Smriti Care</div>
          </div>
          
          {/* Language Switcher */}
          <div className="relative">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="appearance-none bg-stone-100 hover:bg-stone-200 border-none text-stone-700 text-sm font-medium py-2 pl-3 pr-8 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="as">অসমীয়া</option>
              <option value="mni">মৈতৈলোন্</option>
              <option value="kha">Khasi</option>
              <option value="lus">Mizo</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-stone-900 mb-2">{t('auth.welcome_back')}</h2>
          <p className="text-stone-500 mb-8">{t('auth.sign_in_to_continue')}</p>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 mb-4 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-stone-700">{t('auth.password')}</label>
                <Link to="/forgot-password" className="text-xs text-teal-600 hover:text-teal-700">{t('auth.forgot_password')}</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pr-12 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                t('auth.login')
              )}
            </button>
          </form>

          <p className="text-center text-stone-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 font-medium hover:text-teal-700">
              {t('auth.register')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
