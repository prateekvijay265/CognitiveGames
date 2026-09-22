import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Gamepad2, TrendingUp, User } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useReminderEngine } from '../hooks/useReminderEngine';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

export default function PatientLayout() {
  const { fontSize } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useReminderEngine();

  const navItems = [
    { to: '/patient',          label: 'Home',     icon: Home,        exact: true },
    { to: '/patient/games',    label: 'Games',    icon: Gamepad2                 },
    { to: '/patient/progress', label: 'Progress', icon: TrendingUp               },
    { to: '/patient/settings', label: 'Profile',  icon: User                     },
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

      {/* 🚀 Desktop Top Navigation */}
      <header className="w-full bg-kraft border-b-[3px] border-ink shadow-[0_4px_0_var(--color-ink)] relative z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Neuro Mind" className="w-10 h-10 object-cover bg-vermilion border-2 border-ink shadow-[2px_2px_0_var(--color-ink)]" />
            <div className="font-display font-bold text-2xl uppercase tracking-widest text-ink mt-1">Neuro Mind</div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-8">
            {navItems.map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => cn(
                  'flex items-center gap-2 group transition-all',
                  isActive ? 'text-ink' : 'text-sand hover:text-ink'
                )}
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      'w-10 h-10 flex items-center justify-center border-2 transition-all',
                      isActive 
                        ? 'bg-vermilion border-ink text-kraft shadow-[2px_2px_0_var(--color-ink)] -translate-y-0.5' 
                        : 'bg-kraft2 border-transparent group-hover:border-ink group-hover:shadow-[2px_2px_0_var(--color-ink)]'
                    )}>
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={cn(
                      'font-mono text-sm font-bold uppercase tracking-widest mt-1',
                      isActive ? 'text-ink' : 'text-sand'
                    )}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* 📜 Main Content Area (Full Desktop Grid) */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-8 relative z-10">
        <div className="paper grain w-full min-h-full border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
