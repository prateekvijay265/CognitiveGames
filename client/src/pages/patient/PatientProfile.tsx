import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Gamepad2, Globe, HelpCircle,
  ChevronRight, LogOut, ChevronLeft, Check, X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const LANGUAGES = [
  { code: 'en',  label: 'English',    native: 'English',      flag: '🇮🇳' },
  { code: 'hi',  label: 'Hindi',      native: 'हिन्दी',         flag: '🇮🇳' },
  { code: 'as',  label: 'Assamese',   native: 'অসমীয়া',       flag: '🇮🇳' },
  { code: 'mni', label: 'Meitei',     native: 'মৈতৈলোন্',     flag: '🇮🇳' },
  { code: 'kha', label: 'Khasi',      native: 'Ka Ktien Khasi', flag: '🇮🇳' },
  { code: 'lus', label: 'Mizo',       native: 'Mizo ṭawng',   flag: '🇮🇳' },
];

export default function PatientProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { i18n } = useTranslation();
  const patientName = user?.name || 'Abhishek';

  const [showLanguage, setShowLanguage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 pt-6 pb-8 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/patient')} className="icon-btn">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-bold text-ink text-xl uppercase tracking-widest">
            Profile & Settings
          </h1>
          <p className="smallcaps text-sand">Personalise your experience</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="arcade-card p-6 flex items-center gap-6">
        <div className="w-16 h-16 bg-vermilion border-2 border-ink flex items-center justify-center shadow-[3px_3px_0_var(--color-ink)] flex-shrink-0">
          <span className="font-display font-black text-kraft text-2xl">
            {patientName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="font-display font-bold text-ink text-lg uppercase tracking-wider">{patientName}</h2>
          <p className="smallcaps text-sand">Brain Training User</p>
          <p className="font-mono text-ink/50 text-xs mt-1">{user?.email}</p>
        </div>
      </div>

      {/* ── Language Section ── */}
      <div>
        <p className="smallcaps text-sand mb-2 px-1">Language</p>
        <div className="arcade-card overflow-hidden">
          <button
            onClick={() => setShowLanguage(!showLanguage)}
            className="w-full flex items-center justify-between p-6 hover:bg-kraft2 transition-colors group"
          >
            <div className="flex items-center gap-6 text-ink">
              <Globe className="w-5 h-5 text-ink/70" />
              <div className="text-left">
                <span className="font-mono font-bold text-ink block">{currentLang.label}</span>
                <span className="text-xs text-sand font-mono">{currentLang.native}</span>
              </div>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-ink/50 transition-transform duration-200 ${showLanguage ? 'rotate-90' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showLanguage && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t-2 border-ink"
              >
                <div className="p-2 bg-kraft2 space-y-1">
                  {LANGUAGES.map((lang) => {
                    const isActive = i18n.language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          localStorage.setItem('Neuro Mind_language', lang.code);
                          toast.success(`Language changed to ${lang.label}`);
                          setShowLanguage(false);
                        }}
                        className={`w-full flex items-center justify-between px-6 py-3 transition-all border-2 ${
                          isActive
                            ? 'border-ink bg-ink text-kraft shadow-[2px_2px_0_var(--color-vermilion)]'
                            : 'border-transparent hover:border-ink hover:bg-kraft'
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <span className="text-lg">{lang.flag}</span>
                          <div className="text-left">
                            <span className="font-mono font-bold block text-sm">
                              {lang.label}
                            </span>
                            <span className="font-mono text-xs opacity-70">{lang.native}</span>
                          </div>
                        </div>
                        {isActive && <Check className="w-4 h-4 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Notification Preferences ── */}
      <div>
        <p className="smallcaps text-sand mb-2 px-1">Preferences</p>
        <div className="arcade-card overflow-hidden">
          {[
            { icon: Bell,      label: 'Reminder Notifications', detail: 'Daily reminders & alerts' },
            { icon: Gamepad2,  label: 'Game Suggestions',       detail: 'Daily activity tips'       },
            { icon: HelpCircle,label: 'Help & Support',         detail: 'Get assistance anytime',   onClick: () => navigate('/patient/help') },
          ].map(({ icon: Icon, label, detail, onClick }, idx) => (
            <button
              key={idx}
              onClick={onClick ?? (() => toast.info(`${label} settings coming soon!`))}
              className="w-full flex items-center justify-between p-6 hover:bg-kraft2 transition-colors group border-b last:border-0 border-ink/10"
            >
              <div className="flex items-center gap-6 text-ink">
                <Icon className="w-5 h-5 text-ink/70" />
                <div className="text-left">
                  <span className="font-mono font-bold text-ink block text-sm">{label}</span>
                  <span className="text-xs text-sand font-mono">{detail}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink/40 group-hover:text-ink" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Sign Out ── */}
      <div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="btn btn-primary w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 pb-4 space-y-1">
        <p className="smallcaps text-sand/60">Neuro Mind v1.0</p>
        <p className="smallcaps text-sand/40">Healthy mind. Brighter tomorrow.</p>
      </div>
    </motion.div>
  );
}

