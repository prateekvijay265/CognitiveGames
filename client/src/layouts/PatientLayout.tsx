import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Gamepad2, Bell, TrendingUp, HelpCircle } from 'lucide-react';
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
    { to: '/patient', label: t('nav.home'), icon: Home, exact: true },
    { to: '/patient/games', label: t('nav.games'), icon: Gamepad2 },
    { to: '/patient/reminders', label: t('nav.reminders'), icon: Bell },
    { to: '/patient/progress', label: t('nav.progress'), icon: TrendingUp },
    { to: '/patient/help', label: t('nav.help'), icon: HelpCircle },
  ];

  return (
    <div className={cn(
      'min-h-screen flex flex-col bg-[#f8f7f4] patient-mode',
      fontSize === 'large' && 'text-lg',
      fontSize === 'x-large' && 'text-xl',
    )}>
      {/* Sync status header */}
      <div className="flex justify-end px-4 pt-2">
        <SyncIndicator />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 shadow-lg z-50">
        <div className="flex items-stretch justify-around max-w-lg mx-auto">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => cn(
                'flex flex-col items-center justify-center gap-1 py-3 px-2 flex-1 transition-colors min-h-[4rem]',
                'text-stone-400 hover:text-teal-600',
                isActive && 'text-teal-600 bg-teal-50'
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-xs font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
