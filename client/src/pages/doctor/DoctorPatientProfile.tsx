import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import {
 useParams, useNavigate } from 'react-router-dom';
import {
 motion } from 'framer-motion';
import {

  ArrowLeft,
  Activity,
  Bell,
  MessageSquare,
  FileText,
  Info,
  Download,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
} from 'lucide-react';
import {

  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function DoctorPatientProfile() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const patient = DEMO_PATIENTS.find((p) => p.id === patientId) || DEMO_PATIENTS[0];
  const [activeTab, setActiveTab] = useState<'activity' | 'reminders' | 'notes' | 'reports'>('activity');

  const [notes, setNotes] = useState(DEMO_NOTES);
  const [newNote, setNewNote] = useState('');

  // 4-week performance data
  const activityTrendData = DEMO_COGNITIVE_METRICS.slice(0, 14)
    .reverse()
    .map((m, idx) => ({
      day: `W${Math.floor(idx / 3) + 1}-D${(idx % 3) + 1}`,
      observedAccuracy: m.averageAccuracy,
      benchmark: 75,
    }));

  const domainData = [
    { domain: 'Memory', observedLevel: 80 },
    { domain: 'Attention', observedLevel: 85 },
    { domain: 'Routine Recall', observedLevel: 90 },
    { domain: 'Pattern Reasoning', observedLevel: 72 },
  ];

  const reminderAdherenceData = [
    { day: 'Mon', adherence: 100 },
    { day: 'Tue', adherence: 80 },
    { day: 'Wed', adherence: 100 },
    { day: 'Thu', adherence: 90 },
    { day: 'Fri', adherence: 100 },
    { day: 'Sat', adherence: 85 },
    { day: 'Sun', adherence: 95 },
  ];

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const entry = {
      id: `note-${Date.now()}`,
      patientId: patient.id,
      authorId: 'doctor-1',
      authorName: 'Dr. Ananya Das',
      authorRole: 'doctor' as const,
      content: newNote.trim(),
      isPrivate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([entry, ...notes]);
    setNewNote('');
  };

  const handleDownloadReport = () => {
    const reportText = `
SMRITI CARE - CLINICAL ACTIVITY & ENGAGEMENT REPORT
======================================================
Patient Name: ${patient.name}
Patient Age: ${patient.age}
Primary Dialect / Language: ${patient.language}
Date of Generation: ${new Date().toLocaleDateString()}
Caregiver: Priya Sharma
Attending Clinician: Dr. Ananya Das

1. OBSERVATION PERIOD & ENGAGEMENT
------------------------------------------------------
Total Platform Activities: 48 sessions recorded over 4 weeks.
Average Response Time: 5.2 seconds per item.
Engagement Consistency: Stable and consistent participation observed.

2. OBSERVED PERFORMANCE BY DOMAIN
------------------------------------------------------
- Memory Activities: 80% accuracy
- Attention & Focus: 85% accuracy
- Routine Recall: 90% accuracy
- Pattern Reasoning: 72% accuracy

3. REMINDER ADHERENCE
------------------------------------------------------
Weekly Average Adherence: 92%
Scheduled Medication & Hydration Prompts Acknowledged on Time.

4. CLINICIAN & CAREGIVER NOTES
------------------------------------------------------
- Priya Sharma (Caregiver): Patient maintains positive spirits during tea activities.
- Dr. Ananya Das (Clinician): Engagement levels remain steady. Recommend maintaining routine.

DISCLAIMER:
This report summarizes platform activity and is not a medical diagnosis.
======================================================
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Clinical_Report_${patient.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      <button
        onClick={() => navigate('/doctor/patients')}
        className="text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Patient Registry
      </button>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-blue-100 text-blue-800 font-extrabold text-2xl flex items-center justify-center">
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{patient.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 uppercase">
                {patient.language}
              </span>
            </div>
            <p className="text-stone-500 text-sm mt-0.5">
              Age: {patient.age} • Enrolled: July 2025 • Caregiver: Priya Sharma
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download Clinical Summary
        </button>
      </div>

      {/* Disclaimer strip */}
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-stone-700">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <span>This report summarizes platform activity and is not a medical diagnosis.</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 space-x-6">
        {[
          { id: 'activity', label: 'Activity Overview', icon: Activity },
          { id: 'reminders', label: 'Reminder Adherence', icon: Bell },
          { id: 'notes', label: 'Clinical Observations', icon: MessageSquare },
          { id: 'reports', label: 'Generate Report', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Activity Overview */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-1">Cognitive Activity Trend</h3>
            <p className="text-xs text-stone-500 mb-6">
              4-week observed accuracy over sequential cognitive gaming sessions.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fill: '#78716c', fontSize: 12 }} />
                  <YAxis domain={[40, 100]} tick={{ fill: '#78716c', fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="observedAccuracy"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-1">
              Observed Performance by Domain
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Aggregated accuracy percentages across individual domains.
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="domain" tick={{ fill: '#78716c', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#78716c', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="observedLevel" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reminders */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-1">7-Day Adherence Percentage</h3>
            <p className="text-xs text-stone-500 mb-6">
              Daily percentage of scheduled prompts acknowledged by patient.
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reminderAdherenceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fill: '#78716c', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#78716c', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="adherence" fill="#059669" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddObservation}
            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3"
          >
            <h3 className="font-bold text-stone-900 text-sm">Add Clinical Observation</h3>
            <textarea
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Record clinical impression, routine adjustments, or observed response times..."
              className="w-full p-3 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Post Clinical Observation
            </button>
          </form>

          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{note.authorName}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                      {note.authorRole}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-stone-700">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-stone-900 text-lg">Platform Clinical Summary</h3>
              <p className="text-xs text-stone-500">
                Print-ready documentation for patient medical files.
              </p>
            </div>
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Text Report
            </button>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl space-y-3 text-xs text-stone-700 font-mono">
            <div>Patient: {patient.name} (Age {patient.age})</div>
            <div>Observation Period: Past 4 Weeks</div>
            <div>Platform Activities: 48 sessions recorded</div>
            <div>Average Domain Accuracy: 82% (Consistent)</div>
            <div>Reminder Adherence: 92% (High)</div>
            <div>Attending Clinician: Dr. Ananya Das</div>
            <div className="pt-2 text-stone-500">
              Disclaimer: This report summarizes platform activity and is not a medical diagnosis.
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default DoctorPatientProfile;
