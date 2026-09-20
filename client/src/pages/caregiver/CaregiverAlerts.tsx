import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  User,
  Clock,
  ShieldCheck,
  Check,
} from 'lucide-react';
import type { Alert } from '../../types';


export function CaregiverAlerts() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
  const [activeTab, setActiveTab] = useState<'unread' | 'all' | 'resolved'>('unread');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('all');

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isResolved: true, isRead: true } : a))
    );
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesPatient = selectedPatientId === 'all' || alert.patientId === selectedPatientId;
    if (!matchesPatient) return false;

    if (activeTab === 'unread') return !alert.isResolved;
    if (activeTab === 'resolved') return alert.isResolved;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Patient Alerts
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            System notices regarding missed reminders, reduced activity, or routine shifts.
          </p>
        </div>

        {/* Patient Filter */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-stone-400" />
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-stone-200 rounded-xl text-stone-700 shadow-xs focus:outline-hidden"
          >
            <option value="all">All Patients</option>
            {DEMO_PATIENTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 space-x-6">
        {[
          { id: 'unread', label: 'Unresolved / Attention' },
          { id: 'all', label: 'All Alerts' },
          { id: 'resolved', label: 'Resolved History' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === id
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const patient = DEMO_PATIENTS.find((p) => p.id === alert.patientId);

          const severityStyles = {
            urgent: 'bg-rose-50 border-rose-200 text-rose-800',
            attention: 'bg-amber-50 border-amber-200 text-amber-800',
            info: 'bg-blue-50 border-blue-200 text-blue-800',
          }[alert.severity];

          return (
            <div
              key={alert.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                alert.isResolved ? 'bg-white border-stone-200 opacity-60' : severityStyles
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.isResolved ? 'text-stone-400' : 'text-amber-600'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      {patient?.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/80 border border-stone-200">
                      {alert.severity}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mt-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{alert.message}</p>
                  <span className="text-xs text-stone-400 block mt-2">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!alert.isResolved ? (
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Mark Resolved
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Resolved
                </span>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {filteredAlerts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs">
            <span className="text-4xl block mb-2">🌿</span>
            <h3 className="text-lg font-bold text-stone-900">Everything looks calm.</h3>
            <p className="text-stone-500 text-sm mt-1">
              No active alerts require attention for this filter.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CaregiverAlerts;
