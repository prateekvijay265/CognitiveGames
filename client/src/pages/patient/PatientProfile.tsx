import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Gamepad2, Globe, HelpCircle,
  ChevronRight, LogOut, Check, ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

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

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setShowLanguage(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full font-sans flex flex-col gap-10 max-w-5xl mx-auto"
    >
      <header className="flex flex-col gap-6 border-b-[3px] border-ink pb-8">
        <h1 className="text-5xl font-display font-black text-ink uppercase tracking-wider flex items-center gap-4">
          <User size={48} className="text-vermilion" /> 
          Profile & Settings
        </h1>
        <div className="flex items-center gap-6 p-6 bg-kraft2 border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)]">
          <div className="w-20 h-20 bg-vermilion border-[3px] border-ink flex items-center justify-center text-4xl shadow-[4px_4px_0_var(--color-ink)]">
            {patientName.charAt(0)}
          </div>
          <div>
            <h2 className="font-display font-bold text-3xl uppercase tracking-widest text-ink">{patientName}</h2>
            <p className="font-mono font-bold text-sand uppercase tracking-widest mt-1">Player Profile</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Settings */}
        <div className="flex flex-col gap-6">
          <h3 className="font-display font-bold text-2xl uppercase tracking-widest text-ink mb-2">Preferences</h3>
          
          <button 
            onClick={() => setShowLanguage(true)}
            className="group flex items-center justify-between p-6 bg-kraft border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] hover:bg-kraft2 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-ink)] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ochre border-[3px] border-ink flex items-center justify-center">
                <Globe size={24} className="text-ink stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-xl uppercase tracking-widest text-ink">Language</div>
                <div className="font-mono text-sm font-bold text-sand uppercase tracking-widest">{currentLang.native}</div>
              </div>
            </div>
            <ChevronRight size={24} className="text-ink group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="group flex items-center justify-between p-6 bg-kraft border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] hover:bg-kraft2 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-ink)] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-400 border-[3px] border-ink flex items-center justify-center">
                <Bell size={24} className="text-ink stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-xl uppercase tracking-widest text-ink">Notifications</div>
                <div className="font-mono text-sm font-bold text-sand uppercase tracking-widest">Enabled</div>
              </div>
            </div>
            <ChevronRight size={24} className="text-ink group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Column: Danger Zone */}
        <div className="flex flex-col gap-6">
          <h3 className="font-display font-bold text-2xl uppercase tracking-widest text-ink mb-2">Account</h3>
          
          <button className="group flex items-center justify-between p-6 bg-kraft border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] hover:bg-kraft2 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-ink)] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-400 border-[3px] border-ink flex items-center justify-center">
                <HelpCircle size={24} className="text-ink stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-xl uppercase tracking-widest text-ink">Help & Support</div>
                <div className="font-mono text-sm font-bold text-sand uppercase tracking-widest">Contact Caregiver</div>
              </div>
            </div>
            <ChevronRight size={24} className="text-ink group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={handleLogout}
            className="group flex items-center justify-between p-6 bg-kraft border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] hover:bg-vermilion hover:text-kraft hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-ink)] transition-all mt-auto"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-kraft2 border-[3px] border-ink flex items-center justify-center group-hover:bg-kraft group-hover:text-vermilion">
                <LogOut size={24} className="stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-xl uppercase tracking-widest">Sign Out</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-kraft w-full max-w-2xl border-[4px] border-ink shadow-[12px_12px_0_var(--color-vermilion)] p-8 flex flex-col gap-8 max-h-[90vh]"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-3xl uppercase tracking-widest text-ink">Select Language</h2>
                <button 
                  onClick={() => setShowLanguage(false)}
                  className="w-12 h-12 bg-kraft2 border-[3px] border-ink flex items-center justify-center hover:bg-vermilion hover:text-kraft transition-colors shadow-[4px_4px_0_var(--color-ink)]"
                >
                  <ChevronLeft size={28} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 pb-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      'flex items-center justify-between p-6 border-[3px] border-ink transition-all',
                      i18n.language === lang.code
                        ? 'bg-ink text-kraft shadow-[6px_6px_0_var(--color-vermilion)] -translate-y-1'
                        : 'bg-kraft2 text-ink shadow-[4px_4px_0_var(--color-ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] hover:bg-kraft'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="font-display font-bold text-xl uppercase tracking-widest">{lang.label}</div>
                        <div className="font-mono text-sm uppercase tracking-widest opacity-80">{lang.native}</div>
                      </div>
                    </div>
                    {i18n.language === lang.code && <Check size={28} className="text-vermilion" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
