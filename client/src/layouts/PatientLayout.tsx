import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Gamepad2, TrendingUp, User } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useReminderEngine } from '../hooks/useReminderEngine';
import { cn } from '../lib/utils';
import SyncIndicator from '../components/ui/SyncIndicator';

export default function PatientLayout() {
  const { t } = useTranslation();
  const { fontSize } = useUIStore();

  // Initialize background reminder notifications
  useReminderEngine();

  const navItems = [
    { to: '/patient', label: 'Home', icon: Home, exact: true },
    { to: '/patient/games', label: 'Games', icon: Gamepad2 },
    { to: '/patient/progress', label: 'Progress', icon: TrendingUp },
    { to: '/patient/settings', label: 'Profile', icon: User },
  ];

  return (
    <div className={cn(
      'min-h-[100dvh] flex flex-col bg-felt text-ink patient-mode font-sans relative overflow-hidden',
      fontSize === 'large' && 'text-lg',
      fontSize === 'x-large' && 'text-xl',
    )}>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-[76px] paper grain relative z-10 w-full max-w-[860px] mx-auto shadow-2xl">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/50 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50">
        <div className="flex items-stretch justify-around max-w-lg mx-auto py-2">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              replace
              className={({ isActive }) => cn(
                'flex flex-col items-center justify-center gap-1.5 py-2 px-2 flex-1 transition-all min-h-[4rem]',
                'text-stone-400 hover:text-[#4A856E]',
                isActive && 'text-[#4A856E]'
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={cn("text-[10px] font-semibold transition-all", isActive ? "text-[#4A856E]" : "text-stone-500")}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
