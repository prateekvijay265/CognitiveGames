import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

type UserRole = 'patient' | 'caregiver' | 'doctor' | 'admin';

const ROLE_DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string; name: string }> = {
  patient:   { email: 'patient-easy@demo.com', password: 'Demo@1234', name: 'Asha Devi' },
  caregiver: { email: 'caregiver@demo.com',    password: 'Demo@1234', name: 'Priya Sharma' },
  doctor:    { email: 'doctor@demo.com',       password: 'Demo@1234', name: 'Dr. Ananya Das' },
  admin:     { email: 'admin@demo.com',        password: 'Demo@1234', name: 'Rajiv Borah' },
};

const ROLE_TILES: { role: UserRole; emoji: string; label: string; hint: string }[] = [
  { role: 'patient',   emoji: '01', label: 'Patient',   hint: 'Memory activities' },
  { role: 'caregiver', emoji: '02', label: 'Caregiver',  hint: 'Care dashboard' },
  { role: 'doctor',    emoji: '03', label: 'Clinician',  hint: 'Clinical portal' },
  { role: 'admin',     emoji: '04', label: 'Admin',      hint: 'System control' },
];

const FEATURES = ['15 Cognitive Games', '6 NE Languages', 'Offline-First PWA', 'Voice Guided'];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { setPatientMode } = useUIStore();
  const navigate = useNavigate();

  const [email, setEmail]               = useState('patient-easy@demo.com');
  const [password, setPassword]         = useState('Demo@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  const navigateByRole = (role: UserRole) => {
    const routes: Record<UserRole, string> = {
      patient: '/patient', caregiver: '/caregiver', doctor: '/doctor', admin: '/admin',
    };
    navigate(routes[role] ?? '/');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    clearError();
    const demo = ROLE_DEMO_ACCOUNTS[role];
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
    }
  };

  const performLogin = async (loginEmail: string, loginPass: string, roleHint?: UserRole) => {
    clearError();
    try {
      await login(loginEmail, loginPass);
      const { user } = useAuthStore.getState();
      if (user) {
        setPatientMode(user.role === 'patient');
        navigateByRole((user.role as UserRole) || roleHint || 'patient');
      }
    } catch { /* error handled in store */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password, selectedRole);
  };

  const handleQuickLogin = async (role: UserRole) => {
    handleRoleSelect(role);
    const demo = ROLE_DEMO_ACCOUNTS[role];
    await performLogin(demo.email, demo.password, role);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f4f0e6] font-sans">

      {/* ── LEFT: Notebook Cover / Editorial Brand Panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] flex-col justify-between bg-[#231f1d] text-[#fbf9f4] p-12 relative overflow-hidden flex-shrink-0 border-r border-[#38322e]">
        
        {/* Subtle notebook ruled texture lines */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 28px)'
        }} />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <img src="/logo.jpg" alt="Neuro Mind" className="w-13 h-13 object-cover rounded-2xl border border-white/20 shadow-md" />
            <div>
              <div className="font-display font-bold text-white text-2xl tracking-tight">Neuro Mind</div>
              <div className="font-mono text-[0.7rem] uppercase tracking-widest text-[#a89e90]">Memory Companion</div>
            </div>
          </div>

          {/* Tagline */}
          <h1 className="font-display font-black text-white text-[clamp(2.2rem,3.5vw,3.2rem)] leading-[1.15] tracking-tight mb-6">
            Helping<br />memories<br />stay<br /><span className="text-vermilion">connected.</span>
          </h1>
          <p className="text-[#c7beaf] text-sm leading-relaxed font-sans max-w-sm">
            AI-assisted cognitive wellness and daily memory support platform tailored for families and care teams.
          </p>
        </div>

        {/* Feature chips */}
        <div className="relative z-10 grid grid-cols-2 gap-3 pt-8 border-t border-white/10">
          {FEATURES.map((f) => (
            <div key={f} className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-vermilion flex-shrink-0" />
              <span className="font-mono text-xs text-[#ded7cb]">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Login Form (Clean Paper Journal Card) ─────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto">

        {/* Mobile brand header */}
        <div className="flex items-center gap-3.5 mb-8 lg:hidden self-start">
          <img src="/logo.jpg" alt="Neuro Mind" className="w-11 h-11 object-cover rounded-xl border border-ink/20 shadow-xs" />
          <div>
            <div className="font-display font-bold text-ink text-xl">Neuro Mind</div>
            <div className="font-mono text-[0.65rem] uppercase tracking-wider text-sand">Memory Companion</div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 1, 0.4, 1] }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#e2d9cc] shadow-[0_4px_24px_rgba(45,35,20,0.05),0_1px_3px_rgba(45,35,20,0.06)]"
        >
          {/* Header */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-ink text-3xl tracking-tight mb-1">
              Sign In
            </h2>
            <p className="font-sans text-sm text-sand">Select your role or enter credentials to continue</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-sand">Choose Role:</p>
              <span className="text-[0.65rem] font-mono text-vermilion font-semibold">Auto-fills Demo</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ROLE_TILES.map(({ role, emoji, label }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedRole === role
                        ? 'border-vermilion bg-vermilion/10 text-ink shadow-xs font-bold ring-2 ring-vermilion/30'
                        : 'border-[#e2d9cc] bg-[#fbf9f4] text-stone-700 hover:border-stone-400 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-display font-black tracking-tighter">{emoji}</span>
                    <span className="font-sans text-[0.72rem] font-semibold tracking-tight text-center leading-none uppercase">{label}</span>
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
                className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-3 mb-4 text-xs font-mono"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* Email */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-sand mb-1.5">Email Address</label>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-sand">Password</label>
                <Link to="/forgot-password" className="font-mono text-xs text-vermilion hover:underline">
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
                  className="arcade-input w-full pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-3 disabled:opacity-60 cursor-pointer shadow-xs py-3 rounded-xl text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign In as ${ROLE_TILES.find(r => r.role === selectedRole)?.label || 'User'} →`
              )}
            </button>
          </form>

          {/* 1-Click Fast Login Section */}
          <div className="mt-6 pt-5 border-t border-stone-200/80">
            <p className="text-[0.68rem] font-mono uppercase tracking-widest text-center text-sand mb-3 font-semibold">
              ⚡ Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_TILES.map(({ role, emoji, label }) => (
                <button
                  key={`quick-${role}`}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin(role)}
                  className="text-xs font-sans py-2 px-3 bg-[#fbf9f4] hover:bg-stone-100 border border-[#e2d9cc] rounded-xl transition-all text-left flex items-center gap-2 cursor-pointer disabled:opacity-50 text-stone-800"
                >
                  <span className="font-display font-black text-ink">{emoji}</span>
                  <span className="truncate font-semibold text-[0.78rem] uppercase">Login {label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center font-sans text-xs text-stone-500 mt-6">
            New here?{' '}
            <Link to="/register" className="text-vermilion font-bold hover:underline">
              Create account
            </Link>
          </p>

          {/* Language selector */}
          <div className="mt-5 flex justify-center">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="arcade-select text-xs py-1.5 px-3 rounded-lg"
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
