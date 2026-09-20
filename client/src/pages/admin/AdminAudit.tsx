import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  ArrowUpDown,
  Lock,
} from 'lucide-react';

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'auth' | 'sync' | 'clinical' | 'settings';
  details: string;
  ipAddress: string;
}

export function AdminAudit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Realistic generated audit entries
  const [auditLogs] = useState<AuditEvent[]>([
    {
      id: 'aud-1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      actor: 'Priya Sharma (Caregiver)',
      action: 'PATIENT_PROFILE_SYNCED',
      category: 'sync',
      details: 'Patient Asha Devi synced 3 offline sessions from local IndexedDB.',
      ipAddress: '103.28.246.12 (Guwahati)',
    },
    {
      id: 'aud-2',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      actor: 'Dr. Ananya Das (Doctor)',
      action: 'CLINICAL_NOTE_POSTED',
      category: 'clinical',
      details: 'Recorded 4-week observation review for patient Mohan Basumatary.',
      ipAddress: '14.139.218.34 (Dispur)',
    },
    {
      id: 'aud-3',
      timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      actor: 'System Engine',
      action: 'ADAPTIVE_DIFFICULTY_EVALUATED',
      category: 'clinical',
      details: 'Adjusted Memory Match difficulty for Lalhmingmawii Sailo to easy.',
      ipAddress: '127.0.0.1 (Internal Engine)',
    },
    {
      id: 'aud-4',
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      actor: 'Rajiv Borah (Admin)',
      action: 'USER_ROLE_VERIFIED',
      category: 'settings',
      details: 'Verified healthcare worker credential for Dr. Ananya Das.',
      ipAddress: '117.218.42.10 (Jorhat)',
    },
    {
      id: 'aud-5',
      timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
      actor: 'Asha Devi (Patient)',
      action: 'SESSION_COMPLETED',
      category: 'clinical',
      details: 'Completed Sequence Memory (Score: 90%, RT: 4200ms).',
      ipAddress: '103.28.246.12 (Guwahati)',
    },
    {
      id: 'aud-6',
      timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
      actor: 'Priya Sharma (Caregiver)',
      action: 'REMINDER_CREATED',
      category: 'settings',
      details: 'Added Evening Walk routine reminder scheduled for 17:00 daily.',
      ipAddress: '103.28.246.12 (Guwahati)',
    },
    {
      id: 'aud-7',
      timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
      actor: 'Rajiv Borah (Admin)',
      action: 'AUTH_LOGIN_SUCCESS',
      category: 'auth',
      details: 'Admin session initiated with JWT multi-factor bearer.',
      ipAddress: '117.218.42.10 (Jorhat)',
    },
  ]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || log.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [auditLogs, searchTerm, categoryFilter]);

  const handleExportCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'Actor', 'Action', 'Category', 'Details', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      l.action,
      l.category,
      `"${l.details}"`,
      `"${l.ipAddress}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smriti_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Compliance & Integrity
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Security & Operational Audit Log
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Immutable audit trail of patient data synchronizations, clinical observations, and admin actions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Audit Trail (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit actions, actors, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Event Categories</option>
            <option value="auth">Authentication & Access</option>
            <option value="sync">Offline / Online Sync</option>
            <option value="clinical">Clinical & Cognitive</option>
            <option value="settings">System & Settings</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50/80 font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-6">Details</th>
                <th className="py-3.5 px-4">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.map((log) => {
                const categoryStyles = {
                  auth: 'bg-amber-50 text-amber-800 border-amber-200',
                  sync: 'bg-teal-50 text-teal-800 border-teal-200',
                  clinical: 'bg-blue-50 text-blue-800 border-blue-200',
                  settings: 'bg-purple-50 text-purple-800 border-purple-200',
                }[log.category];

                return (
                  <tr key={log.id} className="hover:bg-stone-50/70">
                    <td className="py-3.5 px-6 text-stone-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-800 whitespace-nowrap">
                      {log.actor}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${categoryStyles}`}
                      >
                        {log.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-stone-700 max-w-sm">{log.details}</td>

                    <td className="py-3.5 px-4 font-mono text-stone-400 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminAudit;
