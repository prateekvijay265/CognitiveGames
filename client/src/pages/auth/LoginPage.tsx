import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

type UserRole = 'patient' | 'caregiver' | 'doctor' | 'admin';

const ROLE_TILES: { role: UserRole; emoji: string; label: string; hint: string }[] = [
  { role: 'patient',   emoji: '🧠', label: 'Patient',   hint: 'Memory activities' },
  { role: 'caregiver', emoji: '💚', label: 'Caregiver',  hint: 'Care dashboard' },
  { role: 'doctor',    emoji: '🩺', label: 'Clinician',  hint: 'Clinical portal' },
  { role: 'admin',     emoji: '⚡', label: 'Admin',      hint: 'System control' },
];

const FEATURES = ['15 Cognitive Games', '6 NE Languages', 'Offline-First PWA', 'Voice Guided'];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { setPatientMode } = useUIStore();
  const navigate = useNavigate();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const navigateByRole = (role: UserRole) => {
    const routes: Record<UserRole, string> = {
      patient: '/patient', caregiver: '/caregiver', doctor: '/doctor', admin: '/admin',
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
    } catch { /* error handled in store */ }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row felt-surface font-sans">

      {/* ── LEFT: Brand Panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] flex-col justify-between border-r-2 border-kraft/15 p-10 relative overflow-hidden flex-shrink-0">
        {/* Felt texture overlay */}
        <div className="absolute inset-0 feltsurface opacity-80 pointer-events-none" />
        
        {/* Decorative chess-board corner */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 opacity-[0.06]">
          <div className="grid grid-cols-8 w-full h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className={`${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-kraft' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-vermilion border-2 border-kraft flex items-center justify-center shadow-[4px_4px_0_var(--color-kraft)]">
              <span className="font-display font-black text-kraft text-2xl">S</span>
            </div>
            <div>
              <div className="font-display font-bold text-kraft text-xl uppercase tracking-widest">Smriti Care</div>
              <div className="smallcaps text-kraft/50">Memory Companion</div>
            </div>
          </div>

          {/* Tagline */}
          <h1 className="font-display font-black text-kraft text-[clamp(2rem,3.5vw,3rem)] leading-tight uppercase mb-4">
            Helping<br />memories<br />stay<br />connected.
          </h1>
          <p className="text-kraft/60 text-sm leading-relaxed font-mono max-w-xs">
            AI-assisted cognitive wellness and daily memory support platform for families across North-Eastern India.
          </p>
        </div>

        {/* Feature chips */}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div key={f} className="border border-kraft/25 px-3 py-2.5 flex items-center gap-2">
              <div className="w-2 h-2 bg-vermilion flex-shrink-0" />
              <span className="smallcaps text-kraft/70">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Login Form ─────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 paper grain relative overflow-y-auto">

        {/* Mobile brand header */}
        <div className="flex items-center gap-3 mb-8 lg:hidden self-start">
          <div className="w-12 h-12 bg-vermilion border-2 border-ink flex items-center justify-center shadow-[3px_3px_0_var(--color-ink)]">
            <span className="font-display font-black text-kraft text-xl">S</span>
          </div>
          <div>
            <div className="font-display font-bold text-ink text-lg uppercase tracking-widest">Smriti Care</div>
            <div className="smallcaps text-sand">Memory Companion</div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 1, 0.4, 1] }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-7">
            <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-wider mb-1">
              Sign In
            </h2>
            <p className="smallcaps text-sand">Enter your credentials to continue</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="smallcaps text-sand mb-3">I am a —</p>
            <div className="grid grid-cols-4 gap-2">
              {ROLE_TILES.map(({ role, emoji, label }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex flex-col items-center gap-1.5 p-3 border-2 transition-all ${
                    selectedRole === role
                      ? 'border-ink bg-ink text-kraft shadow-[3px_3px_0_var(--color-vermilion)]'
                      : 'border-kraft3 bg-kraft2 text-ink hover:border-ink hover:shadow-[2px_2px_0_var(--color-ink)]'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="smallcaps text-[0.55rem]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-2 border-vermilion bg-vermilion/10 text-vermilion p-3 mb-4 text-sm font-mono"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="smallcaps text-sand block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="arcade-input w-full"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="smallcaps text-sand">Password</label>
                <Link to="/forgot-password" className="smallcaps text-vermilion hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="arcade-input w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand hover:text-ink transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <p className="text-center font-mono text-sm text-sand mt-6">
            New here?{' '}
            <Link to="/register" className="text-vermilion font-bold hover:underline">
              Create account
            </Link>
          </p>

          {/* Language selector */}
          <div className="mt-8 flex justify-center">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="arcade-select text-xs"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="as">অসমীয়া</option>
              <option value="mni">মৈতৈলোন্</option>
              <option value="kha">Khasi</option>
              <option value="lus">Mizo</option>
            </select>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
