import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Users, Bell, BarChart3, AlertCircle,
  FileText, Settings, LogOut, Menu, X, ShieldCheck,
  Stethoscope, Activity, UserCog, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { cn } from '../lib/utils';
import SyncIndicator from '../components/ui/SyncIndicator';

type Role = 'caregiver' | 'doctor' | 'admin';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

function getNavItems(role: Role): NavItem[] {
  const base: Record<Role, NavItem[]> = {
    caregiver: [
      { to: '/caregiver', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/caregiver/patients', label: 'Patients', icon: Users },
      { to: '/caregiver/reminders', label: 'Reminders', icon: Bell },
      { to: '/caregiver/alerts', label: 'Alerts', icon: AlertCircle },
      { to: '/caregiver/reports', label: 'Reports', icon: FileText },
      { to: '/caregiver/settings', label: 'Settings', icon: Settings },
    ],
    doctor: [
      { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/doctor/patients', label: 'Patients', icon: Users },
      { to: '/doctor/reports', label: 'Reports', icon: FileText },
    ],
    admin: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/users', label: 'Users', icon: UserCog },
      { to: '/admin/content', label: 'Content', icon: Activity },
      { to: '/admin/audit', label: 'Audit Logs', icon: ShieldCheck },
    ],
  };
  return base[role] ?? [];
}

const ROLE_META = {
  caregiver: { label: 'Caregiver', icon: Users, color: 'teal' },
  doctor: { label: 'Clinical', icon: Stethoscope, color: 'blue' },
  admin: { label: 'Admin', icon: ShieldCheck, color: 'purple' },
};

export default function DashboardLayout({ role }: { role: Role }) {
  const { t } = useTranslation();
  const { logout, user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const navItems = getNavItems(role);
  const meta = ROLE_META[role];
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <div className="font-bold text-stone-900 text-lg leading-tight">Smriti Care</div>
            <div className="text-xs text-stone-400">{meta.label} Portal</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 mx-2 mt-3 bg-stone-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-stone-900 text-sm truncate">{user?.name}</div>
            <div className="text-xs text-stone-400 truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length <= 2}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive
                ? 'bg-teal-50 text-teal-700 shadow-sm'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-teal-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-6 space-y-1 border-t border-stone-100 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#f8f7f4]">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-white border-r border-stone-100 transition-all duration-300 flex-shrink-0',
        sidebarOpen ? 'w-64' : 'w-16'
      )}>
        {sidebarOpen ? (
          <SidebarContent />
        ) : (
          <div className="flex flex-col items-center py-4 gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            {navItems.map(({ to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to.split('/').length <= 2}
                className={({ isActive }) => cn(
                  'w-10 h-10 flex items-center justify-center rounded-xl transition-colors',
                  isActive ? 'bg-teal-50 text-teal-700' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
                )}
              >
                {({ isActive }) => <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />}
              </NavLink>
            ))}
          </div>
        )}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-100 px-4 lg:px-6 py-3 flex items-center gap-4 sticky top-0 z-40">
          {/* Sidebar toggle */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) setMobileOpen(!mobileOpen);
              else toggleSidebar();
            }}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-stone-900 text-base truncate">
              {meta.label} Portal
            </h1>
          </div>

          <SyncIndicator />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
