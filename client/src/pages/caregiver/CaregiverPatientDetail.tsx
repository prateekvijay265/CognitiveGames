import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import {
 useParams, useNavigate } from 'react-router-dom';
import {
 motion } from 'framer-motion';
import {

  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Heart,
  FileText,
  Activity,
  Bell,
  ListTodo,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  SlidersHorizontal,
  Info,
  ChevronRight,
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
  Legend,
} from 'recharts';
import { toast } from 'sonner';

export function CaregiverPatientDetail() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const patient = DEMO_PATIENTS.find((p) => p.id === patientId) || DEMO_PATIENTS[0];
  
  if (!patient) {
    return (
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto mt-16 lg:mt-0 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-stone-900 mb-2">Patient Not Found</h2>
          <p className="text-stone-500 mb-6">We couldn't find the requested patient profile.</p>
          <button onClick={() => navigate('/caregiver/patients')} className="px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700">
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<
    'overview' | 'cognitive' | 'games' | 'reminders' | 'routine' | 'notes'
  >('overview');

  // Local state for interactive features
  const [notes, setNotes] = useState(DEMO_NOTES.filter((n) => n.patientId === patient.id || true));
  const [newNoteContent, setNewNoteContent] = useState('');
  const [reminders, setReminders] = useState(DEMO_REMINDERS);
  const [routineList, setRoutineList] = useState(DEMO_ROUTINE);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '3m'>('30d');

  // Filter game sessions for this patient
  const patientSessions = DEMO_GAME_SESSIONS.filter(
    (s) => s.patientId === patient.id || s.patientId === 'pat-1'
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      patientId: patient.id,
      authorId: 'caregiver-1',
      authorName: 'Priya Sharma',
      authorRole: 'caregiver' as const,
      content: newNoteContent.trim(),
      isPrivate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
  };

  // Domain breakdown calculation
  const domainPerformance = [
    { domain: 'Memory', score: 78, fill: '#0d9488' },
    { domain: 'Attention', score: 84, fill: '#0284c7' },
    { domain: 'Routine Recall', score: 92, fill: '#d97706' },
    { domain: 'Pattern Reasoning', score: 70, fill: '#7c3aed' },
  ];

  // Cognitive line chart data over 4 weeks
  const cognitiveData = DEMO_COGNITIVE_METRICS.slice(0, 14)
    .reverse()
    .map((m, idx) => ({
      date: `Day ${idx + 1}`,
      accuracy: m.averageAccuracy,
      benchmark: 75,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/caregiver/patients')}
        className="text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Patient List
      </button>

      {/* Patient Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-teal-100 text-teal-800 font-extrabold text-2xl flex items-center justify-center shadow-xs">
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{patient.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 uppercase">
                {patient.language}
              </span>
            </div>
            <p className="text-stone-500 text-sm mt-1">
              Age: {patient.age} • Emergency Contact: {patient.emergencyContact?.name} ({patient.emergencyContact?.relationship})
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 mt-2">
              <span>Caregiver: Priya Sharma</span>
              <span>•</span>
              <span>Physician: Dr. Ananya Das</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">● Synced Just Now</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/caregiver/settings')}
          className="px-4 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200 transition-colors flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Accessibility Settings
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 space-x-1 sm:space-x-4 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'cognitive', label: 'Cognitive Activity', icon: Sparkles },
          { id: 'games', label: 'Game Sessions', icon: FileText },
          { id: 'reminders', label: 'Reminders', icon: Bell },
          { id: 'routine', label: 'Daily Routine', icon: ListTodo },
          { id: 'notes', label: 'Notes & Observations', icon: MessageSquare },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`py-3 px-3 sm:px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === id
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Today's Activity Summary */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <h3 className="font-bold text-stone-900 text-base mb-2">Today's Progress</h3>
              <div className="text-3xl font-black text-teal-600 mb-2">4 of 5 Done</div>
              <p className="text-xs text-stone-500 mb-3">
                Completed Memory Match, Sequence Memory, and Morning Tea Routine.
              </p>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-4/5 rounded-full" />
              </div>
            </div>

            {/* Reminder Completion */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <h3 className="font-bold text-stone-900 text-base mb-2">Today's Reminders</h3>
              <div className="text-3xl font-black text-emerald-600 mb-2">100%</div>
              <p className="text-xs text-stone-500">
                All scheduled medication and hydration prompts acknowledged on time.
              </p>
            </div>

            {/* Latest Mood */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <h3 className="font-bold text-stone-900 text-base mb-2">Latest Mood</h3>
              <div className="text-3xl mb-1">😊 Peaceful & Good</div>
              <p className="text-xs text-stone-500">
                Recorded at 8:30 AM after breakfast and tea.
              </p>
            </div>
          </div>

          {/* Recent 5 Sessions Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">Recent Game Performance</h3>
              <span className="text-xs text-stone-500">Latest 5 sessions</span>
            </div>
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 font-bold uppercase text-stone-400">
                <tr>
                  <th className="py-3 px-4">Game</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Hints</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {patientSessions.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/70">
                    <td className="py-3 px-4 font-bold text-stone-800 capitalize">
                      {s.gameId.replace('-', ' ')}
                    </td>
                    <td className="py-3 px-4 capitalize">{s.difficulty}</td>
                    <td className="py-3 px-4 font-bold text-teal-600">{s.accuracy}%</td>
                    <td className="py-3 px-4">{Math.round(s.responseTimeMs / 1000)}s</td>
                    <td className="py-3 px-4">{s.hintsUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Cognitive Activity */}
      {activeTab === 'cognitive' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Observed Performance Trend</h3>
                <p className="text-xs text-stone-500">
                  Performance has remained relatively consistent over the selected period.
                </p>
              </div>
              <div className="flex gap-1 bg-stone-100 p-1 rounded-xl self-start">
                {(['7d', '30d', '3m'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setDateRange(r)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      dateRange === r ? 'bg-white text-stone-800 shadow-xs' : 'text-stone-500'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cognitiveData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fill: '#78716c', fontSize: 12 }} />
                  <YAxis domain={[40, 100]} tick={{ fill: '#78716c', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="benchmark" stroke="#cbd5e1" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 bg-stone-50 rounded-xl flex items-center gap-2 text-xs text-stone-500">
              <Info className="w-4 h-4 text-stone-400 shrink-0" />
              <span>
                Note: This report summarizes platform cognitive activity and is not a medical diagnosis.
              </span>
            </div>
          </div>

          {/* Domain Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-4">Domain Participation & Performance</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="domain" tick={{ fill: '#78716c', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#78716c', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#0d9488" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Games */}
      {activeTab === 'games' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">Full Game History</h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg">
              Most Engaged: Memory Match
            </span>
          </div>
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 font-bold uppercase text-stone-400">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Game</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Response Time</th>
                <th className="py-3 px-4">Hints Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {patientSessions.slice(0, 12).map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4 text-stone-500">
                    {new Date(s.startedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-800 capitalize">
                    {s.gameId.replace('-', ' ')}
                  </td>
                  <td className="py-3 px-4 capitalize">{s.difficulty}</td>
                  <td className="py-3 px-4 font-bold text-teal-600">{s.accuracy}%</td>
                  <td className="py-3 px-4">{Math.round(s.responseTimeMs / 1000)}s</td>
                  <td className="py-3 px-4">{s.hintsUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Reminders */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-base">Configured Reminders</h3>
            <button
              onClick={() => toast.success('Add reminder modal coming soon.')}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Reminder
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reminders.map((rem) => (
              <div key={rem.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    {rem.type}
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm mt-1">{rem.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{rem.description}</p>
                  <div className="flex items-center gap-3 text-xs font-semibold text-stone-600 mt-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{rem.scheduledTime} (Daily)</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Routine */}
      {activeTab === 'routine' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
          <h3 className="font-bold text-stone-900 text-base mb-4">Patient Daily Routine Timeline</h3>
          <div className="space-y-3">
            {routineList.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-xs font-bold text-stone-400 w-6">{idx + 1}</span>
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-stone-800">{item.title}</h4>
                  <span className="text-xs text-stone-400">{item.scheduledTime} • {item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Add note box */}
          <form onSubmit={handleAddNote} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">Add Care Observation</h3>
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write a note about the patient's engagement, mood, or health..."
              rows={3}
              className="w-full p-3 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Post Note
            </button>
          </form>

          {/* Notes list */}
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
    </motion.div>
  );
}

export default CaregiverPatientDetail;
