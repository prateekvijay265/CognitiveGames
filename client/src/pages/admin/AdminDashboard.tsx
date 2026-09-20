import { useAppDataStore } from '@/store/appDataStore';
import React from 'react';
import {
 motion } from 'framer-motion';
import {

  Users,
  ShieldCheck,
  Server,
  Database,
  RefreshCw,
  Globe,
  Activity,
  CheckCircle2,
  HardDrive,
  FileText,
} from 'lucide-react';
import {

  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export function AdminDashboard() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const totalUsers = 48;
  const totalPatients = DEMO_PATIENTS.length;
  const totalCaregivers = 12;
  const totalDoctors = 6;
  const totalSessions = DEMO_GAME_SESSIONS.length;
  const supportedLanguagesCount = 6;

  // Pie chart data: User distribution by role
  const roleDistribution = [
    { name: 'Patients', value: 25, color: '#0d9488' },
    { name: 'Caregivers', value: 14, color: '#2563eb' },
    { name: 'Clinicians', value: 6, color: '#7c3aed' },
    { name: 'Admins', value: 3, color: '#d97706' },
  ];

  // Bar chart data: Language distribution
  const languageData = [
    { language: 'English', users: 18 },
    { language: 'Assamese', users: 15 },
    { language: 'Manipuri', users: 6 },
    { language: 'Mizo', users: 4 },
    { language: 'Khasi', users: 3 },
    { language: 'Hindi', users: 2 },
  ];

  // Recent audit log entries
  const recentAudit = [
    { id: '1', action: 'PATIENT_PROFILE_SYNCED', actor: 'Priya Sharma (Caregiver)', time: '5 mins ago' },
    { id: '2', action: 'DIFFICULTY_BASELINE_UPDATED', actor: 'Dr. Ananya Das (Doctor)', time: '22 mins ago' },
    { id: '3', action: 'SESSION_OFFLINE_SAVED', actor: 'Asha Devi (Patient)', time: '1 hour ago' },
    { id: '4', action: 'REMINDER_NOTIFICATION_FIRED', actor: 'System Scheduler', time: '2 hours ago' },
    { id: '5', action: 'USER_ROLE_VERIFIED', actor: 'Rajiv Borah (Admin)', time: '3 hours ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> System Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            SMRITI CARE Platform Infrastructure
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            System health, active database metrics, user distribution, and security audit logs.
          </p>
        </div>

        {/* System Health Indicators (All Green) */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl text-xs font-bold text-emerald-800 self-start sm:self-auto shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All Services Operational: API • DB • Sync • PWA</span>
        </div>
      </div>

      {/* Stats Cards Row (6 stats) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400">Total Users</span>
          <div className="text-2xl font-black text-stone-900 mt-1">{totalUsers}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+8 this month</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400">Patients</span>
          <div className="text-2xl font-black text-teal-600 mt-1">{totalPatients}</div>
          <span className="text-[10px] text-stone-500 font-medium">All active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400">Caregivers</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{totalCaregivers}</div>
          <span className="text-[10px] text-stone-500 font-medium">Verified credentials</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400">Doctors</span>
          <div className="text-2xl font-black text-purple-600 mt-1">{totalDoctors}</div>
          <span className="text-[10px] text-stone-500 font-medium">Clinical observers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400">Game Sessions</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{totalSessions}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% synced</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-stone-400">Languages</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{supportedLanguagesCount}</div>
          <span className="text-[10px] text-stone-500 font-medium">NE Regional</span>
        </div>
      </div>

      {/* Charts Grid: User Distribution Pie + Language Usage Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution PieChart */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-1">User Role Distribution</h2>
          <p className="text-xs text-stone-500 mb-4">Breakdown of platform accounts by security role</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Usage BarChart */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-1">Language Dialect Distribution</h2>
          <p className="text-xs text-stone-500 mb-4">Patient active preferences across North-Eastern languages</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="language" tick={{ fill: '#78716c', fontSize: 11 }} />
                <YAxis tick={{ fill: '#78716c', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="users" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Health Indicators Strip & Audit Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Details */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900">Service Infrastructure Health</h2>
          <div className="space-y-3">
            {[
              { name: 'Core API Gateway', latency: '42ms', status: 'Healthy', icon: Server },
              { name: 'PostgreSQL Primary DB', latency: '8ms', status: 'Healthy', icon: Database },
              { name: 'IndexedDB Client Engine', latency: 'Local', status: 'Operational', icon: HardDrive },
              { name: 'Background Queue Sync', latency: 'Online', status: 'Synced', icon: RefreshCw },
            ].map((srv) => (
              <div
                key={srv.name}
                className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <srv.icon className="w-4 h-4 text-stone-500" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-800">{srv.name}</h4>
                    <span className="text-[10px] text-stone-400">Response: {srv.latency}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Log Preview (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">Recent Security Audit Events</h2>
              <p className="text-xs text-stone-500">Live operational audit stream</p>
            </div>
            <span className="text-xs font-bold text-purple-700">Audit Active</span>
          </div>

          <div className="divide-y divide-stone-100">
            {recentAudit.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-stone-800 block">{log.action}</span>
                  <span className="text-stone-500 text-[11px]">{log.actor}</span>
                </div>
                <span className="text-stone-400 text-[11px] whitespace-nowrap">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
