import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Bell,
  Check,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuthStore } from '../../store/authStore';


export function CaregiverDashboard() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(DEMO_ALERTS);

  const activePatientsCount = DEMO_PATIENTS.length;
  const todaySessions = DEMO_GAME_SESSIONS.filter((s) => {
    const d = new Date(s.startedAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const todayActivitiesCount = todaySessions.length > 0 ? todaySessions.length : 12;

  const pendingAlerts = alerts.filter((a) => !a.isResolved);

  const markAlertResolved = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isResolved: true } : a))
    );
  };

  // 7-day activity trend data for the area chart
  const weeklyData = [
    { day: 'Mon', activities: 14, completionRate: 85 },
    { day: 'Tue', activities: 18, completionRate: 90 },
    { day: 'Wed', activities: 15, completionRate: 82 },
    { day: 'Thu', activities: 20, completionRate: 94 },
    { day: 'Fri', activities: 16, completionRate: 88 },
    { day: 'Sat', activities: 22, completionRate: 91 },
    { day: 'Sun', activities: 19, completionRate: 87 },
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
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Priya'}. 👋
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Here is what is happening across your assigned patients today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/caregiver/reminders"
            className="px-4 py-2 bg-white border border-stone-200 text-stone-700 font-medium text-sm rounded-xl shadow-xs hover:bg-stone-50 transition-colors flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-stone-500" />
            Schedule Reminder
          </Link>
          <Link
            to="/caregiver/reports"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Generate Report
          </Link>
        </div>
      </div>

      {/* Stats Cards Row (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Patients (Blue) */}
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Active Patients
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">
              {activePatientsCount}
            </div>
            <span className="text-xs text-stone-500 mt-1 block">5 under regular care</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Activities (Green) */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Today's Activities
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">
              {todayActivitiesCount}
            </div>
            <span className="text-xs text-emerald-600 mt-1 block font-medium">
              Completed on schedule
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Reminder Completion (Amber) */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Reminder Completion
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">87%</div>
            <span className="text-xs text-stone-500 mt-1 block">+4% from last week</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Alerts (Red) */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                Pending Alerts
              </span>
              {pendingAlerts.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">
                  {pendingAlerts.length}
                </span>
              )}
            </div>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">
              {pendingAlerts.length}
            </div>
            <span className="text-xs text-rose-600 mt-1 block">Requires attention</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Patient Overview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Patient Overview</h2>
            <p className="text-xs text-stone-500">Live progress and daily routine adherence</p>
          </div>
          <Link
            to="/caregiver/patients"
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Patient Cards Grid (3 columns on desktop, 1 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEMO_PATIENTS.map((patient) => {
            const hasAlert = alerts.some((a) => a.patientId === patient.id && !a.isResolved);
            const initials = patient.name
              .split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <div
                key={patient.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Avatar + Name + Alerts */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-base">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-base">{patient.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-stone-500">Age: {patient.age}</span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                            {patient.language}
                          </span>
                        </div>
                      </div>
                    </div>

                    {hasAlert && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                        Alert
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-stone-500">Today's Progress</span>
                      <span className="text-stone-800 font-bold">75%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full w-[75%]" />
                    </div>
                  </div>

                  {/* Info stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-stone-100 mb-4">
                    <div>
                      <span className="text-stone-400 block">Reminders</span>
                      <span className="font-semibold text-emerald-600">3/3 Done</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Last Active</span>
                      <span className="font-medium text-stone-700">Today, 8:30 AM</span>
                    </div>
                  </div>
                </div>

                {/* Card Button */}
                <button
                  onClick={() => navigate(`/caregiver/patients/${patient.id}`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-50 hover:bg-teal-50 hover:text-teal-700 text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-stone-200 hover:border-teal-200"
                >
                  View Patient Details <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Weekly Activity Chart + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Weekly Engagement Activity</h2>
              <p className="text-xs text-stone-500">
                Cognitive sessions completed across all patients
              </p>
            </div>
            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
              Past 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#78716c', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#78716c', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e7e5e4',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="activities"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorActivities)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts Section (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-stone-900">Recent Alerts</h2>
              <Link to="/caregiver/alerts" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                All Alerts
              </Link>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => {
                const patient = DEMO_PATIENTS.find((p) => p.id === alert.patientId);

                return (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl border transition-all ${
                      alert.isResolved
                        ? 'bg-stone-50/60 border-stone-200 opacity-60'
                        : 'bg-amber-50/40 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            alert.isResolved ? 'text-stone-400' : 'text-amber-600'
                          }`}
                        />
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{alert.title}</h4>
                          <span className="text-[11px] text-stone-500 font-medium">
                            {patient?.name || 'Patient'}
                          </span>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                            {alert.message}
                          </p>
                        </div>
                      </div>

                      {!alert.isResolved && (
                        <button
                          onClick={() => markAlertResolved(alert.id)}
                          className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-semibold rounded-lg shadow-2xs whitespace-nowrap"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <span className="text-xs text-stone-400 block text-center">
              Alerts update automatically via cloud sync
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CaregiverDashboard;
