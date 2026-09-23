import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../store/uiStore';
import { useReminderEngine } from '../hooks/useReminderEngine';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

export default function PatientLayout() {
  const { t, i18n } = useTranslation();
  const { fontSize } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useReminderEngine();

  const navItems = [
    { to: '/patient',          label: t('arcade.home', 'Home'),     exact: true },
    { to: '/patient/games',    label: t('arcade.games', 'Games')                 },
    { to: '/patient/progress', label: 'Progress'              },
    { to: '/patient/settings', label: 'Profile'               },
  ];

  return (
    <div
      className={cn(
        'w-full min-h-[100dvh] flex flex-col felt-surface text-ink font-sans relative patient-mode',
        fontSize === 'large'   && 'text-lg',
        fontSize === 'x-large' && 'text-xl',
      )}
    >
      {/* 📺 Scan-line decorative overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.03]">
        <div
          className="absolute w-full h-[2px] bg-kraft"
          style={{ animation: 'scan-line 6s linear infinite' }}
        />
      </div>

      {/* 🚀 Top Navigation */}
      <header className="w-full bg-paper border-b-[3px] border-ink sticky top-0 z-50">
        <div className="w-full px-4 sm:px-8 xl:px-12 h-16 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/patient')}>
            <div className="font-display font-black text-2xl uppercase tracking-tighter text-ink leading-none">
              NEURO<br/>MIND
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-2 h-full">
            {navItems.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => cn(
                  'h-full flex items-center px-3 sm:px-5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors border-l-[3px] border-transparent',
                  isActive 
                    ? 'border-ink bg-[#e3decf] text-ink' 
                    : 'text-ink/70 hover:text-ink hover:bg-[#e3decf]/50'
                )}
              >
                {label}
              </NavLink>
            ))}
            
            {/* Language Selector */}
            <div className="h-full flex items-center border-l-[3px] border-ink pl-2 sm:pl-4 ml-1 sm:ml-2">
              <select 
                className="bg-paper border-2 border-ink font-mono font-bold text-xs uppercase text-ink px-1 focus:outline-none cursor-pointer hover:bg-[#e3decf]"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="as">AS</option>
                <option value="mni">MNI</option>
                <option value="kha">KHA</option>
                <option value="lus">LUS</option>
              </select>
            </div>
          </nav>
        </div>
      </header>

      {/* 📜 Main Content Area */}
      <main className="flex-1 w-full bg-paper text-ink relative z-10 border-t-2 border-ink">
        <div className="w-full min-h-[calc(100vh-80px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
