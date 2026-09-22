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
      ipAddress: '127.0.0.1 (Internal)',
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
    link.setAttribute('download', `Neuro Mind_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">Administrator • Audit</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Audit Log
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Immutable trail of system events and admin actions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn btn-primary btn-sm flex items-center gap-6 self-start"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="arcade-card p-6 flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search actions or actors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="arcade-input w-full pl-10"
          />
        </div>

        <div className="flex items-center gap-6">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="arcade-select"
          >
            <option value="all">All Categories</option>
            <option value="auth">Auth & Access</option>
            <option value="sync">Offline Sync</option>
            <option value="clinical">Clinical</option>
            <option value="settings">Settings</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="arcade-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="arcade-table w-full">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action Event</th>
                <th>Actor</th>
                <th>Category</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const getCategoryBadge = (cat: string) => {
                  switch(cat) {
                    case 'auth': return 'badge-ochre';
                    case 'sync': return 'badge-green';
                    case 'clinical': return 'badge-vermilion';
                    default: return 'badge-sand';
                  }
                };

                return (
                  <tr key={log.id}>
                    <td className="font-mono text-xs text-sand whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="font-mono font-bold text-ink text-xs">
                      {log.action}
                    </td>

                    <td className="font-bold text-ink text-sm whitespace-nowrap">
                      {log.actor}
                    </td>

                    <td>
                      <span className={`badge ${getCategoryBadge(log.category)}`}>
                        {log.category}
                      </span>
                    </td>

                    <td className="text-ink text-sm max-w-sm">
                      {log.details}
                    </td>

                    <td className="font-mono text-xs text-sand whitespace-nowrap">
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

