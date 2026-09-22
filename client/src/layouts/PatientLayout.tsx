import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Gamepad2, TrendingUp, User, Menu, X, Bell, Settings } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useReminderEngine } from '../hooks/useReminderEngine';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

export default function PatientLayout() {
  const { fontSize } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  useReminderEngine();

  const navItems = [
    { to: '/patient',          label: 'Home',     icon: Home,     exact: true },
    { to: '/patient/games',    label: 'Games',    icon: Gamepad2               },
    { to: '/patient/progress', label: 'Progress', icon: TrendingUp             },
    { to: '/patient/settings', label: 'Profile',  icon: User                   },
  ];

  return (
    <div
      className={cn(
        'min-h-[100dvh] flex flex-col felt-surface text-ink font-sans relative patient-mode',
        fontSize === 'large'   && 'text-lg',
        fontSize === 'x-large' && 'text-xl',
      )}
    >
      {/* ── Scan-line decorative overlay ─────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.03]">
        <div
          className="absolute w-full h-[2px] bg-kraft"
          style={{ animation: 'scan-line 6s linear infinite' }}
        />
      </div>

      {/* ── Main paper column ─────────────────────────────── */}
      <main
        className={cn(
          'flex-1 overflow-y-auto pb-[76px] paper grain relative z-10',
          'w-full max-w-[480px] mx-auto',
          // On larger screens, give it a subtle shadow so it looks like a centred card
          'lg:shadow-[8px_0_48px_rgba(0,0,0,0.35),-8px_0_48px_rgba(0,0,0,0.35)]',
          'lg:min-h-[100dvh]',
        )}
      >
        <Outlet />
      </main>

      {/* ── Bottom Navigation ─────────────────────────────── */}
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'paper border-t-2 border-ink',
          // Centre the nav bar to match the paper column on wide screens
          'lg:max-w-[480px] lg:mx-auto lg:left-auto lg:right-auto',
          'lg:border-l-2 lg:border-r-2',
        )}
      >
        <div className="flex items-stretch justify-around px-2 py-1">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              replace
              className={({ isActive }) => cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-3 flex-1 transition-all min-h-[3.75rem] group',
                isActive ? 'text-ink' : 'text-sand hover:text-ink',
              )}
            >
              {({ isActive }) => (
                <>
                  {/* Active dot indicator */}
                  <span
                    className={cn(
                      'w-1 h-1 rounded-full mb-0.5 transition-all duration-300',
                      isActive ? 'bg-vermilion scale-150' : 'bg-transparent',
                    )}
                  />
                  <div className={cn(
                    'w-10 h-10 flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'bg-ink text-kraft shadow-[2px_2px_0_var(--color-vermilion)]'
                      : 'bg-transparent group-hover:bg-kraft3',
                  )}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn(
                    'text-[9px] font-mono font-bold uppercase tracking-widest',
                    isActive ? 'text-ink' : 'text-sand',
                  )}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
