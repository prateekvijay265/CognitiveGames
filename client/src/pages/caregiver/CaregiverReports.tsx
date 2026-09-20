import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import {
 motion } from 'framer-motion';
import {

  FileText,
  Download,
  Printer,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export function CaregiverReports() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0].id);
  const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d'>('30d');

  const selectedPatient =
    DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0];

  const sessions = DEMO_GAME_SESSIONS.filter(
    (s) => s.patientId === selectedPatient.id || s.patientId === 'pat-1'
  );

  const averageAccuracy = Math.round(
    sessions.reduce((acc, s) => acc + s.accuracy, 0) / Math.max(1, sessions.length)
  );

  // Download CSV export function
  const handleDownloadCSV = () => {
    const headers = ['Session ID', 'Game', 'Difficulty', 'Accuracy (%)', 'Duration (ms)', 'Date'];
    const rows = sessions.map((s) => [
      s.id,
      s.gameId,
      s.difficulty,
      s.accuracy,
      s.responseTimeMs,
      new Date(s.startedAt).toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smriti_report_${selectedPatient.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Activity & Engagement Reports
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Export structured summary data for clinical review or family records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-stone-200 text-stone-700 font-semibold text-xs rounded-xl shadow-xs hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            Print Report
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-wrap items-center gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-stone-400" />
          <span className="text-xs font-bold text-stone-500">Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-hidden"
          >
            {DEMO_PATIENTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-400" />
          <span className="text-xs font-bold text-stone-500">Time Window:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-hidden"
          >
            <option value="7d">Past 7 Days</option>
            <option value="14d">Past 14 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* Printable Report Preview Canvas */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-8">
        {/* Report Top Header */}
        <div className="border-b border-stone-200 pb-6 flex justify-between items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
              SMRITI CARE PLATFORM REPORT
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">{selectedPatient.name}</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Age: {selectedPatient.age} • Primary Language: {selectedPatient.language} • Generated on{' '}
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-stone-400 block">Observation Period</span>
            <span className="text-sm font-bold text-stone-700">Past {dateRange}</span>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-xs font-semibold text-stone-400 block">Total Activities</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{sessions.length}</div>
            <span className="text-xs text-teal-600 font-medium">Completed on device</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-xs font-semibold text-stone-400 block">Observed Accuracy</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{averageAccuracy}%</div>
            <span className="text-xs text-stone-500 font-medium">Platform benchmark: 75%</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-xs font-semibold text-stone-400 block">Reminder Adherence</span>
            <div className="text-2xl font-black text-stone-900 mt-1">92%</div>
            <span className="text-xs text-emerald-600 font-medium">High adherence</span>
          </div>
        </div>

        {/* Clinical Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-700 text-xs">
          <strong>Observation Notice:</strong> This summary details platform activity, cognitive
          game engagement, and scheduled reminder responses. It is intended for caregiver
          coordination and clinical observation. It does not constitute a diagnostic medical evaluation.
        </div>

        {/* Sessions Activity Table */}
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
            Recent Activity Log
          </h3>
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-stone-400 font-bold uppercase border-y border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Activity</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sessions.slice(0, 8).map((s) => (
                <tr key={s.id}>
                  <td className="py-2 px-3">{new Date(s.startedAt).toLocaleDateString()}</td>
                  <td className="py-2 px-3 font-semibold text-stone-800 capitalize">
                    {s.gameId.replace('-', ' ')}
                  </td>
                  <td className="py-2 px-3 capitalize">{s.difficulty}</td>
                  <td className="py-2 px-3 font-bold text-teal-600">{s.accuracy}%</td>
                  <td className="py-2 px-3">{Math.round(s.responseTimeMs / 1000)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default CaregiverReports;
