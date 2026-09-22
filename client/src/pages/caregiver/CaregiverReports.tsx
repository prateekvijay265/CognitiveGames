import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Calendar, User } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export function CaregiverReports() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS } = useAppDataStore();
  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0]?.id || '');
  const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d'>('30d');

  if (DEMO_PATIENTS.length === 0) {
    return (
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto mt-16 lg:mt-0 flex items-center justify-center">
        <EmptyState title="NO PATIENTS" description="Add a patient to view their reports." />
      </div>
    );
  }

  const selectedPatient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0];
  const sessions = DEMO_GAME_SESSIONS.filter(
    (s) => s.patientId === selectedPatient.id || s.patientId === 'pat-1'
  );

  const averageAccuracy = Math.round(
    sessions.reduce((acc, s) => acc + s.accuracy, 0) / Math.max(1, sessions.length)
  );

  const handleDownloadCSV = () => {
    const headers = ['Session ID', 'Game', 'Difficulty', 'Accuracy (%)', 'Duration (ms)', 'Date'];
    const rows = sessions.map((s) => [
      s.id, s.gameId, s.difficulty, s.accuracy, s.responseTimeMs, new Date(s.startedAt).toISOString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smriti_report_${selectedPatient.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => window.print();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <div className="smallcaps text-sand mb-1">Caregiver • Reports</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Activity Reports
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn btn-ghost btn-sm flex items-center gap-2">
            <Printer size={16} /> PRINT
          </button>
          <button onClick={handleDownloadCSV} className="btn btn-primary btn-sm flex items-center gap-2">
            <Download size={16} /> EXPORT CSV
          </button>
        </div>
      </div>

      <div className="arcade-card p-4 bg-kraft2 flex flex-wrap gap-4 items-center print:hidden">
        <div className="flex items-center gap-2">
          <User size={16} className="text-ink" />
          <span className="smallcaps text-ink">PATIENT:</span>
          <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} className="arcade-select py-1">
            {DEMO_PATIENTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-ink" />
          <span className="smallcaps text-ink">WINDOW:</span>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value as any)} className="arcade-select py-1">
            <option value="7d">PAST 7 DAYS</option>
            <option value="14d">PAST 14 DAYS</option>
            <option value="30d">PAST 30 DAYS</option>
          </select>
        </div>
      </div>

      {/* Report Canvas */}
      <div className="arcade-card p-6 md:p-8 bg-paper grain border-4 border-ink">
        <div className="border-b-4 border-ink pb-6 flex justify-between items-start mb-6">
          <div>
            <div className="font-mono font-bold text-sm text-vermilion uppercase tracking-widest">SMRITI CARE REPORT</div>
            <h2 className="font-display font-bold text-3xl text-ink uppercase tracking-widest mt-2">{selectedPatient.name}</h2>
            <p className="font-mono text-sand text-sm mt-1 uppercase">AGE: {selectedPatient.age} • LANG: {selectedPatient.language}</p>
          </div>
          <div className="text-right">
            <span className="smallcaps text-sand block">PERIOD</span>
            <span className="font-mono font-bold text-ink uppercase">PAST {dateRange}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="stat-card" style={{ padding: '1rem', minHeight: 'auto' }}>
            <div className="stat-label mb-1">SESSIONS</div>
            <div className="stat-value text-3xl">{sessions.length}</div>
          </div>
          <div className="stat-card" style={{ padding: '1rem', minHeight: 'auto' }}>
            <div className="stat-label mb-1">ACCURACY</div>
            <div className="stat-value text-3xl">{averageAccuracy}%</div>
          </div>
          <div className="stat-card" style={{ padding: '1rem', minHeight: 'auto' }}>
            <div className="stat-label mb-1">ADHERENCE</div>
            <div className="stat-value text-3xl">92%</div>
          </div>
        </div>

        <div className="p-4 border-2 border-dashed border-ochre bg-kraft2 text-sm font-mono text-ink mb-8">
          <strong>NOTE:</strong> This summary details platform activity for caregiver coordination. Not a medical diagnosis.
        </div>

        <div>
          <h3 className="font-display font-bold uppercase tracking-widest text-ink mb-4">ACTIVITY LOG</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm arcade-table">
              <thead className="bg-ink text-kraft uppercase">
                <tr>
                  <th className="p-3">DATE</th>
                  <th className="p-3">GAME</th>
                  <th className="p-3">DIFF</th>
                  <th className="p-3">ACC</th>
                  <th className="p-3">TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {sessions.slice(0, 8).map((s) => (
                  <tr key={s.id} className="hover:bg-kraft2">
                    <td className="p-3">{new Date(s.startedAt).toLocaleDateString()}</td>
                    <td className="p-3 uppercase">{s.gameId.replace('-', ' ')}</td>
                    <td className="p-3 uppercase">{s.difficulty}</td>
                    <td className="p-3 font-bold text-vermilion">{s.accuracy}%</td>
                    <td className="p-3">{Math.round(s.responseTimeMs / 1000)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CaregiverReports;
