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
    <div className="flex flex-col h-full bg-white">
      {/* Brand */}
      <div className={cn(
        'border-b border-[#e2d9cc] flex-shrink-0 bg-[#fbf9f4]',
        compact ? 'p-3' : 'px-5 py-6',
      )}>
        {compact ? (
          <div className="flex flex-col items-center gap-2">
            <img src="/logo.jpg" alt="Neuro Mind" className="w-10 h-10 object-cover rounded-xl border border-ink/20 shadow-xs" />
          </div>
        ) : (
          <div className="flex items-center gap-3.5">
            <img src="/logo.jpg" alt="Neuro Mind" className="w-12 h-12 object-cover rounded-xl border border-ink/20 shadow-xs flex-shrink-0" />
            <div>
              <div className="font-display font-bold text-ink text-xl leading-tight">Neuro Mind</div>
              <div className="font-mono text-sand font-bold uppercase tracking-widest text-[0.65rem] mt-0.5">{meta.tag}</div>
            </div>
          </div>
        )}
      </div>

      {/* User card */}
      {!compact && (
        <div className="mx-4 my-4 p-3.5 bg-[#fbf9f4] border border-[#e2d9cc] rounded-xl flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex-shrink-0 rounded-lg border border-ink/20 flex items-center justify-center font-display font-bold text-white text-base shadow-xs"
              style={{ backgroundColor: meta.accent }}
            >
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <div className="min-w-0">
              <div className="font-sans font-bold text-ink text-sm truncate">{user?.name ?? 'User'}</div>
              <div className="font-mono text-sand text-[0.68rem] truncate uppercase tracking-wider">{meta.label}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length <= 2}
            replace
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all',
              isActive 
                ? 'bg-vermilion text-white shadow-xs font-semibold' 
                : 'text-stone-600 hover:text-ink hover:bg-stone-100',
              compact && 'justify-center !px-2',
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={compact ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                {!compact && <span className="flex-1 truncate">{label}</span>}
                {!compact && isActive && <ChevronRight size={14} className="text-white/70 flex-shrink-0" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={cn(
        'border-t border-[#e2d9cc] flex-shrink-0 bg-[#fbf9f4]',
        compact ? 'px-2 py-3' : 'px-3 py-3',
      )}>
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-stone-600 hover:text-red-600 hover:bg-red-50 w-full transition-all cursor-pointer',
            compact && 'justify-center !px-2',
          )}
        >
          <LogOut size={compact ? 20 : 18} />
          {!compact && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f4f0e6] font-sans">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col border-r border-[#e2d9cc] flex-shrink-0 transition-all duration-300 shadow-xs',
        sidebarOpen ? 'w-64' : 'w-[68px]',
      )}>
        <SidebarContent compact={!sidebarOpen} />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 flex flex-col border-r border-[#e2d9cc] bg-white shadow-xl">
            <SidebarContent compact={false} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-[#e2d9cc] px-4 lg:px-8 py-3.5 flex items-center gap-4 sticky top-0 z-40 flex-shrink-0 shadow-xs">
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
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-sand hidden sm:block">{meta.label} Portal</span>
            <span className="h-4 border-l border-stone-300 hidden sm:block" />
            <SyncIndicator />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <div className="font-sans text-sm font-semibold text-ink hidden md:block">{user?.name}</div>
            <div
              className="w-9 h-9 rounded-xl border border-ink/20 flex items-center justify-center font-display font-bold text-white text-sm shadow-xs"
              style={{ backgroundColor: meta.accent }}
            >
              {user?.name?.charAt(0) ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1800px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
