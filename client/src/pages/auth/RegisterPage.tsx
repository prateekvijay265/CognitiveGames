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
  { value: 'doctor' as UserRole, label: 'Doctor / Healthcare Worker', icon: Stethoscope, desc: 'I provide clinical care' },
  { value: 'admin' as UserRole, label: 'Administrator', icon: ShieldCheck, desc: 'I manage the platform' },
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
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center p-6">
      {/* Top bar */}
      <div className="w-full max-w-lg flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
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
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-lg"
      >
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-stone-900 mb-2 text-center">Create your account</h2>
            <p className="text-stone-500 mb-8 text-center">Who are you joining as?</p>
            <div className="space-y-3">
              {ROLES.map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  onClick={() => handleRoleSelect(value)}
                  className="w-full flex items-center gap-4 bg-white rounded-2xl p-5 border border-stone-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all text-left shadow-sm hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={22} className="text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">{label}</div>
                    <div className="text-sm text-stone-500">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center text-stone-500 text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 font-medium">{t('auth.login')}</Link>
            </p>
          </>
        ) : (
          <>
            <button onClick={() => setStep(1)} className="text-teal-600 text-sm mb-4 hover:text-teal-700">← Change role</button>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Create your account</h2>
            <p className="text-stone-500 mb-8">Joining as: <strong className="text-stone-900">{ROLES.find((r) => r.value === role)?.label}</strong></p>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="At least 8 characters"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
