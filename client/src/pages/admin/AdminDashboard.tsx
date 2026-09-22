import { useAppDataStore } from '@/store/appDataStore';
import React from 'react';
import { motion } from 'framer-motion';
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
    { name: 'Patients', value: 25, color: '#1a1512' }, // ink
    { name: 'Caregivers', value: 14, color: '#675b4c' }, // sand
    { name: 'Clinicians', value: 6, color: '#e0451f' }, // vermilion
    { name: 'Admins', value: 3, color: '#d99a2b' }, // ochre
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">Administrator • Dashboard</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest flex items-center gap-6">
            <ShieldCheck className="w-6 h-6 text-ochre" /> System Admin
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            System health, metrics, and global administration.
          </p>
        </div>

        <div className="badge badge-green self-start">
          <CheckCircle2 className="w-3 h-3 inline mr-1" />
          All Services Operational
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="stat-card animate-card-in">
          <div className="stat-value">{totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>

        <div className="stat-card animate-card-in animation-delay-200">
          <div className="stat-value text-vermilion">{totalPatients}</div>
          <div className="stat-label">Patients</div>
        </div>

        <div className="stat-card animate-card-in animation-delay-200">
          <div className="stat-value">{totalCaregivers}</div>
          <div className="stat-label">Caregivers</div>
        </div>

        <div className="stat-card animate-card-in animation-delay-400">
          <div className="stat-value">{totalDoctors}</div>
          <div className="stat-label">Doctors</div>
        </div>

        <div className="stat-card animate-card-in animation-delay-400">
          <div className="stat-value text-ochre">{totalSessions}</div>
          <div className="stat-label">Sessions</div>
        </div>

        <div className="stat-card animate-card-in animation-delay-400">
          <div className="stat-value">{supportedLanguagesCount}</div>
          <div className="stat-label">Languages</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution PieChart */}
        <div className="arcade-card p-6">
          <h2 className="smallcaps text-ink mb-1">User Role Distribution</h2>
          <p className="font-mono text-sand text-xs mb-4">Breakdown of platform accounts by security role</p>

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
                  stroke="#1a1512"
                  strokeWidth={2}
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#e7dcc6', border: '2px solid #1a1512', borderRadius: 0, fontFamily: 'IBM Plex Mono', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: '#1a1512' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Usage BarChart */}
        <div className="arcade-card p-6">
          <h2 className="smallcaps text-ink mb-1">Language Dialect Distribution</h2>
          <p className="font-mono text-sand text-xs mb-4">Patient active preferences across North-Eastern languages</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,21,18,0.08)" vertical={false} />
                <XAxis dataKey="language" tick={{ fill: '#675b4c', fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
                <YAxis tick={{ fill: '#675b4c', fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
                <Tooltip contentStyle={{ background: '#e7dcc6', border: '2px solid #1a1512', borderRadius: 0, fontFamily: 'IBM Plex Mono', fontSize: 12 }} />
                <Bar dataKey="users" fill="#d99a2b" stroke="#1a1512" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Health Indicators Strip & Audit Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Details */}
        <div className="arcade-card p-6 space-y-8">
          <h2 className="smallcaps text-ink">Service Infrastructure Health</h2>
          <div className="space-y-3">
            {[
              { name: 'Core API Gateway', latency: '42ms', status: 'Healthy', icon: Server },
              { name: 'PostgreSQL Primary DB', latency: '8ms', status: 'Healthy', icon: Database },
              { name: 'IndexedDB Client Engine', latency: 'Local', status: 'Operational', icon: HardDrive },
              { name: 'Background Queue Sync', latency: 'Online', status: 'Synced', icon: RefreshCw },
            ].map((srv) => (
              <div
                key={srv.name}
                className="p-3 bg-kraft2 border-2 border-ink flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <srv.icon className="w-5 h-5 text-ink" />
                  <div>
                    <h4 className="font-bold text-ink text-sm">{srv.name}</h4>
                    <span className="font-mono text-xs text-sand">Ping: {srv.latency}</span>
                  </div>
                </div>
                <span className="badge badge-green">
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Log Preview */}
        <div className="lg:col-span-2 arcade-card p-6 space-y-8">
          <div className="flex items-center justify-between border-b-2 border-ink/10 pb-2">
            <div>
              <h2 className="smallcaps text-ink">Recent Security Audit Events</h2>
              <p className="font-mono text-sand text-xs">Live operational stream</p>
            </div>
            <span className="badge badge-vermilion animate-pulse">Live</span>
          </div>

          <div className="divide-y-2 divide-ink/5">
            {recentAudit.map((log) => (
              <div key={log.id} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-ink text-sm block">{log.action}</span>
                  <span className="text-sand text-xs font-bold">{log.actor}</span>
                </div>
                <span className="font-mono text-sand text-xs whitespace-nowrap">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
