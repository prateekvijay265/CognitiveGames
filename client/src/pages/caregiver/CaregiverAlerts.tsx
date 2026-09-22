import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, User, Check } from 'lucide-react';
import type { Alert } from '../../types';

export function CaregiverAlerts() {
  const { patients: DEMO_PATIENTS, alerts: DEMO_ALERTS } = useAppDataStore();

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">Caregiver • Inbox</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Patient Alerts
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            System notices regarding missed reminders, reduced activity, or routine shifts.
          </p>
        </div>

        <div className="flex items-center gap-6 arcade-card p-2 bg-kraft2 self-start sm:self-auto">
          <User className="w-4 h-4 text-ink ml-1" />
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="arcade-select text-sm py-1 border-none bg-transparent"
          >
            <option value="all">ALL PATIENTS</option>
            {DEMO_PATIENTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide border-b-2 border-kraft/30">
        {[
          { id: 'unread', label: 'UNRESOLVED' },
          { id: 'all', label: 'ALL ALERTS' },
          { id: 'resolved', label: 'RESOLVED' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`px-6 py-2 flex items-center gap-6 font-mono text-sm uppercase transition-all whitespace-nowrap ${
              activeTab === id
                ? 'bg-vermilion text-kraft border-2 border-vermilion'
                : 'bg-transparent text-kraft border-2 border-transparent hover:border-kraft/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-8">
        {filteredAlerts.map((alert, idx) => {
          const patient = DEMO_PATIENTS.find((p) => p.id === alert.patientId);
          
          let badgeClass = 'badge-ochre';
          if (alert.severity === 'urgent') badgeClass = 'badge-vermilion';
          if (alert.severity === 'info') badgeClass = 'bg-blue-600 text-kraft border-blue-800';

          return (
            <div
              key={alert.id}
              className={`arcade-card p-6 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-fade-up ${
                alert.isResolved ? 'opacity-70 bg-kraft2' : 'bg-kraft'
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                <div className={`mt-1 ${alert.isResolved ? 'text-sand' : 'text-vermilion'}`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-6 mb-1">
                    <span className="font-mono font-bold text-ink uppercase">
                      {patient?.name || 'UNKNOWN'}
                    </span>
                    <span className={`badge ${badgeClass}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-ink text-base sm:text-lg uppercase">
                    {alert.title}
                  </h3>
                  <p className="font-mono text-sand text-sm mt-1">{alert.message}</p>
                  <span className="smallcaps text-sand block mt-3">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!alert.isResolved ? (
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  className="btn btn-sm self-start sm:self-center flex items-center gap-6 bg-kraft2"
                >
                  <Check size={14} /> RESOLVE
                </button>
              ) : (
                <span className="smallcaps text-sand flex items-center gap-1 self-start sm:self-center bg-kraft3 px-2 py-1 border-2 border-ink">
                  <CheckCircle2 size={14} /> RESOLVED
                </span>
              )}
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="arcade-card p-12 text-center bg-kraft2">
            <span className="text-4xl block mb-4">👾</span>
            <h3 className="font-display font-bold uppercase text-ink tracking-widest text-xl mb-2">ALL CLEAR</h3>
            <p className="font-mono text-sand">No active alerts match this filter.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CaregiverAlerts;
