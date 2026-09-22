import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Users, Bell, BarChart3, AlertCircle,
  FileText, Settings, LogOut, Menu, X, ShieldCheck,
  Stethoscope, Activity, UserCog, ChevronRight, Zap,
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
      { to: '/caregiver',          label: 'Dashboard', icon: LayoutDashboard },
      { to: '/caregiver/patients', label: 'Patients',  icon: Users           },
      { to: '/caregiver/reminders',label: 'Reminders', icon: Bell            },
      { to: '/caregiver/alerts',   label: 'Alerts',    icon: AlertCircle     },
      { to: '/caregiver/reports',  label: 'Reports',   icon: FileText        },
      { to: '/caregiver/settings', label: 'Settings',  icon: Settings        },
    ],
    doctor: [
      { to: '/doctor',             label: 'Dashboard', icon: LayoutDashboard },
      { to: '/doctor/patients',    label: 'Patients',  icon: Users           },
      { to: '/doctor/reports',     label: 'Reports',   icon: FileText        },
    ],
    admin: [
      { to: '/admin',              label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/users',        label: 'Users',     icon: UserCog         },
      { to: '/admin/content',      label: 'Content',   icon: Activity        },
      { to: '/admin/audit',        label: 'Audit',     icon: ShieldCheck     },
    ],
  };
  return base[role] ?? [];
}

const ROLE_META = {
  caregiver: { label: 'Caregiver',  icon: Users,       accent: '#2563eb',  tag: 'CARE HUB'   },
  doctor:    { label: 'Clinician',  icon: Stethoscope, accent: '#7c3aed',  tag: 'CLINIC'     },
  admin:     { label: 'Admin',      icon: ShieldCheck, accent: '#d97706',  tag: 'CONTROL'    },
};

export default function DashboardLayout({ role }: { role: Role }) {
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

  const SidebarContent = ({ compact = false }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={cn(
        'border-b-2 border-kraft/20 flex-shrink-0',
        compact ? 'p-3' : 'px-5 py-5',
      )}>
        {compact ? (
          <div className="flex flex-col items-center gap-2">
            <img src="/logo.jpg" alt="Neuro Mind" className="w-10 h-10 object-cover border-2 border-kraft shadow-[2px_2px_0_var(--color-kraft)] bg-vermilion" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Neuro Mind" className="w-12 h-12 object-cover border-2 border-kraft shadow-[3px_3px_0_var(--color-kraft)] flex-shrink-0 bg-vermilion" />
            <div>
              <div className="font-display font-bold text-kraft text-lg leading-tight uppercase tracking-wide">Neuro Mind</div>
              <div className="smallcaps text-kraft/50 mt-0.5">{meta.tag}</div>
            </div>
          </div>
        )}
      </div>

      {/* User card */}
      {!compact && (
        <div className="mx-4 my-4 p-3 bg-felt/30 border border-kraft/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex-shrink-0 border-2 border-kraft flex items-center justify-center font-display font-bold text-kraft text-sm"
              style={{ backgroundColor: meta.accent + '80' }}
            >
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-kraft text-sm truncate leading-tight">{user?.name ?? 'User'}</div>
              <div className="smallcaps text-kraft/50 truncate mt-0.5">{meta.label}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length <= 2}
            replace
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'nav-item',
              isActive && 'active',
              compact && 'justify-center !px-2',
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={compact ? 20 : 17} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                {!compact && <span className="flex-1 truncate">{label}</span>}
                {!compact && isActive && <ChevronRight size={12} className="text-kraft/40 flex-shrink-0" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={cn(
        'border-t-2 border-kraft/20 flex-shrink-0',
        compact ? 'px-2 py-3' : 'px-2 py-3',
      )}>
        <button
          onClick={handleLogout}
          className={cn(
            'nav-item w-full hover:!text-vermilion hover:!bg-vermilion/10',
            compact && 'justify-center !px-2',
          )}
        >
          <LogOut size={compact ? 20 : 17} />
          {!compact && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex felt-surface font-sans">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col border-r-2 border-kraft/15 flex-shrink-0 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-[60px]',
      )}>
        <SidebarContent compact={!sidebarOpen} />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 flex flex-col border-r-2 border-kraft/20" style={{ backgroundColor: '#0f2920' }}>
            <SidebarContent compact={false} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="paper grain border-b-2 border-ink px-4 lg:px-6 py-3 flex items-center gap-4 sticky top-0 z-40 flex-shrink-0">
          {/* Menu toggle */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) setMobileOpen(!mobileOpen);
              else toggleSidebar();
            }}
            className="icon-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Role label */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <span className="smallcaps text-sand hidden sm:block">{meta.label} Portal</span>
            <span className="h-4 border-l-2 border-ink/20 hidden sm:block" />
            <SyncIndicator />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <div className="smallcaps text-sand hidden md:block">{user?.name}</div>
            <div
              className="w-9 h-9 border-2 border-ink flex items-center justify-center font-display font-bold text-kraft text-sm shadow-[2px_2px_0_var(--color-ink)]"
              style={{ backgroundColor: meta.accent }}
            >
              {user?.name?.charAt(0) ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
