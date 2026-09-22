import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import {
 useNavigate } from 'react-router-dom';
import {
 motion } from 'framer-motion';
import {

  Stethoscope,
  Users,
  AlertCircle,
  FileCheck2,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

export function DoctorDashboard() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const navigate = useNavigate();
  const [selectedPatientForNote, setSelectedPatientForNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  const totalPatients = DEMO_PATIENTS.length;
  const needingReview = 2;
  const alertsCount = DEMO_ALERTS.filter((a) => !a.isResolved).length;
  const pendingReports = 1;

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    toast.success('Clinical note recorded.');
    setSelectedPatientForNote(null);
    setNoteContent('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Clinical Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" /> Clinical Observation Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Cognitive Activity & Engagement Monitor
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Observational monitoring of platform adherence, cognitive games, and daily routines.
          </p>
        </div>

        <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto">
          <span>Practitioner: Dr. Ananya Das</span>
        </div>
      </div>

      {/* Clinical Disclaimer Banner */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-stone-700">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Clinical Notice:</strong> Activity data represents observed platform interaction
          and engagement patterns. It is an auxiliary support tool and is not a medical diagnosis.
        </span>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Under Observation
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">{totalPatients}</div>
            <span className="text-xs text-stone-500 mt-0.5 block">North-Eastern cohort</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Needing Clinical Review
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">{needingReview}</div>
            <span className="text-xs text-amber-600 mt-0.5 block">Activity changes noted</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Active Alerts
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">{alertsCount}</div>
            <span className="text-xs text-rose-600 mt-0.5 block">Missed routine prompts</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Generated Reports
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">4</div>
            <span className="text-xs text-stone-500 mt-0.5 block">1 pending sign-off</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Patient Clinical Observation Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Patient Cohort Overview</h2>
            <p className="text-xs text-stone-500">
              Cross-sectional performance and reminder adherence status
            </p>
          </div>
          <span className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-lg">
            Active Roster: {totalPatients} Patients
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50/80 text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Patient Name</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">7-Day Engagement Trend</th>
                <th className="py-3.5 px-4">Reminder Adherence</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {DEMO_PATIENTS.map((p, idx) => {
                const isNeedsReview = idx === 1 || idx === 2;
                const adherence = idx === 1 ? '72%' : idx === 2 ? '65%' : '90%';

                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-stone-900">
                      <div>{p.name}</div>
                      <div className="text-xs text-stone-400 font-normal">Age: {p.age}</div>
                    </td>

                    <td className="py-4 px-4 uppercase text-xs font-semibold text-stone-600">
                      {p.language}
                    </td>

                    <td className="py-4 px-4">
                      {isNeedsReview ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                          <TrendingDown className="w-4 h-4 text-amber-600" /> Slight Dip
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <TrendingUp className="w-4 h-4 text-emerald-600" /> Consistent
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-bold text-stone-800">{adherence}</td>

                    <td className="py-4 px-4 text-xs text-stone-500">
                      {new Date(p.lastActiveAt || Date.now()).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4">
                      {isNeedsReview ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Needs Review
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active & Stable
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPatientForNote(p.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Add Observation
                        </button>
                        <button
                          onClick={() => navigate(`/doctor/patients/${p.id}`)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                        >
                          View Profile <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observation Modal */}
      {selectedPatientForNote && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveObservation}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-stone-900 text-base">Record Clinical Observation</h3>
            <p className="text-xs text-stone-500">
              This note will be timestamped and visible to caregivers and authorized clinicians.
            </p>
            <textarea
              rows={4}
              required
              placeholder="Record observations regarding cognitive stability, engagement rate, or recommended routine adjustments..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full p-3 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedPatientForNote(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Save Clinical Note
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}

export default DoctorDashboard;
