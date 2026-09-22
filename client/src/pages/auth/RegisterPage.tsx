import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, User, Stethoscope, Heart, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

type UserRole = 'patient' | 'caregiver' | 'doctor' | 'admin';

const ROLES = [
  { value: 'patient' as UserRole, label: 'Patient', icon: User, desc: 'I need memory support' },
  { value: 'caregiver' as UserRole, label: 'Caregiver', icon: Heart, desc: 'I care for a loved one' },
  { value: 'doctor' as UserRole, label: 'Doctor', icon: Stethoscope, desc: 'I provide clinical care' },
  { value: 'admin' as UserRole, label: 'Admin', icon: ShieldCheck, desc: 'Platform manager' },
];

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const { setPatientMode } = useUIStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>('caregiver');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await registerUser({ email, password, name, role });
      setPatientMode(role === 'patient');
      const routes: Record<UserRole, string> = {
        patient: '/patient/onboarding',
        caregiver: '/caregiver',
        doctor: '/doctor',
        admin: '/admin',
      };
      navigate(routes[role]);
    } catch {
      // error shown in UI
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* LEFT: Branding */}
      <div className="hidden lg:flex lg:w-1/2 felt-surface p-12 flex-col justify-between text-kraft relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-16">
            <img src="/logo.jpg" alt="Neuro Mind" className="w-12 h-12 object-cover bg-vermilion border-2 border-ink shadow-[2px_2px_0px_rgba(26,21,18,1)]" />
            <div className="font-display font-bold text-2xl uppercase tracking-widest text-kraft drop-shadow-md">
              Neuro Mind
            </div>
          </div>
          <h1 className="font-display text-5xl lg:text-6xl uppercase tracking-widest leading-[1.1] mb-6">
            Join the<br />community.
          </h1>
          <p className="font-mono text-lg text-kraft/80 max-w-md">
            Create an account to start your cognitive wellness journey.
          </p>
        </div>
        <div className="relative z-10 smallcaps text-kraft/60">
          ARCADE RETRO SYSTEM v1.0
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full lg:w-1/2 paper grain flex flex-col justify-center p-8 lg:p-24 relative">
        <div className="absolute top-8 right-8">
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="arcade-select"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="as">AS</option>
          </select>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md mx-auto"
        >
          {step === 1 ? (
            <>
              <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-widest mb-2">Create Account</h2>
              <p className="font-mono text-sand mb-8">Who are you joining as?</p>

              <div className="space-y-8">
                {ROLES.map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => handleRoleSelect(value)}
                    className="arcade-card w-full p-6 flex items-center gap-6 text-left hover-lift bg-white"
                  >
                    <div className="w-12 h-12 bg-ochre border-2 border-ink flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-ink" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-ink uppercase tracking-widest">{label}</div>
                      <div className="font-mono text-sm text-sand">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center font-mono text-sand text-sm mt-8">
                Already have an account?{' '}
                <Link to="/login" className="text-vermilion font-bold hover:underline">
                  {t('auth.login', 'Sign in')}
                </Link>
              </p>
            </>
          ) : (
            <>
              <button 
                onClick={() => setStep(1)} 
                className="font-mono text-vermilion text-sm mb-6 font-bold hover:underline"
              >
                ← Back to roles
              </button>
              <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-widest mb-2">Details</h2>
              <p className="font-mono text-sand mb-8">
                Joining as: <strong className="text-ink bg-ochre px-1">{ROLES.find((r) => r.value === role)?.label}</strong>
              </p>

              {error && (
                <div className="arcade-card bg-vermilion text-kraft p-3 mb-6 font-mono text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block smallcaps text-ink mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="arcade-input w-full"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block smallcaps text-ink mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="arcade-input w-full"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block smallcaps text-ink mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="arcade-input w-full"
                    placeholder="Min 8 characters"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full mt-4 flex items-center justify-center gap-6"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
