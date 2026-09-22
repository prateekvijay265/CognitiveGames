import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Sparkles, FileText, Bell, ListTodo, MessageSquare, SlidersHorizontal, Plus, Trash2, Clock } from 'lucide-react';
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
import { toast } from 'sonner';

export function CaregiverPatientDetail() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, routines: DEMO_ROUTINE, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const patient = DEMO_PATIENTS.find((p) => p.id === patientId) || DEMO_PATIENTS[0];
  
  if (!patient) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center h-full">
        <div className="arcade-card p-8 text-center bg-kraft2">
          <h2 className="font-display font-bold text-ink text-xl uppercase mb-2">Patient Not Found</h2>
          <p className="font-mono text-sand mb-6">We couldn't find the requested patient profile.</p>
          <button onClick={() => navigate('/caregiver/patients')} className="btn btn-primary">Back to Patients</button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<
    'overview' | 'cognitive' | 'games' | 'reminders' | 'routine' | 'notes'
  >('overview');

  const [notes, setNotes] = useState(DEMO_NOTES.filter((n) => n.patientId === patient.id || true));
  const [newNoteContent, setNewNoteContent] = useState('');
  const [reminders, setReminders] = useState(DEMO_REMINDERS);
  const [routineList, setRoutineList] = useState(DEMO_ROUTINE);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '3m'>('30d');

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

  const domainPerformance = [
    { domain: 'Memory', score: 78 },
    { domain: 'Attention', score: 84 },
    { domain: 'Routine', score: 92 },
    { domain: 'Pattern', score: 70 },
  ];

  const cognitiveData = DEMO_COGNITIVE_METRICS.slice(0, 14)
    .reverse()
    .map((m, idx) => ({
      date: `D${idx + 1}`,
      accuracy: m.averageAccuracy,
      benchmark: 75,
    }));

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: Activity },
    { id: 'cognitive', label: 'COGNITIVE', icon: Sparkles },
    { id: 'games', label: 'GAMES', icon: FileText },
    { id: 'reminders', label: 'REMINDERS', icon: Bell },
    { id: 'routine', label: 'ROUTINE', icon: ListTodo },
    { id: 'notes', label: 'NOTES', icon: MessageSquare },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      <button
        onClick={() => navigate('/caregiver/patients')}
        className="btn btn-sm btn-ghost mb-2 inline-flex items-center gap-6"
      >
        <ArrowLeft size={14} /> BACK
      </button>

      {/* Patient Header */}
      <div className="arcade-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-kraft2">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 border-2 border-ink flex items-center justify-center font-display font-bold text-kraft text-3xl shadow-[4px_4px_0px_#1a1512]" style={{ backgroundColor: '#2563eb' }}>
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-6">
              <h1 className="font-display font-bold text-ink text-2xl sm:text-3xl uppercase tracking-widest">{patient.name}</h1>
              <span className="badge bg-ink text-kraft">{patient.language?.toUpperCase()}</span>
            </div>
            <p className="font-mono text-sand text-sm mt-2">
              Age: {patient.age} • Emergency: {patient.emergencyContact?.name} ({patient.emergencyContact?.relationship})
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-sand mt-2 uppercase">
              <span>CG: Priya Sharma</span>
              <span>•</span>
              <span className="text-vermilion font-bold">● SYNCED</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/caregiver/settings')}
          className="btn btn-ghost btn-sm flex items-center gap-6"
        >
          <SlidersHorizontal size={14} /> SETTINGS
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide border-b-2 border-ink">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`px-6 py-2 flex items-center gap-6 font-mono text-sm uppercase transition-all whitespace-nowrap ${
              activeTab === id
                ? 'bg-ink text-kraft'
                : 'bg-transparent text-ink hover:bg-kraft2'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2 animate-fade-up">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="arcade-card p-6">
                <h3 className="smallcaps text-sand mb-2">Today's Progress</h3>
                <div className="text-3xl font-display font-bold text-vermilion mb-3">4 of 5 Done</div>
                <div className="arcade-progress mb-2">
                  <div className="arcade-progress-bar bg-vermilion" style={{ width: '80%' }} />
                </div>
                <p className="text-xs font-mono text-ink">Completed Match, Memory, Routine.</p>
              </div>
              <div className="arcade-card p-6">
                <h3 className="smallcaps text-sand mb-2">Reminders</h3>
                <div className="text-3xl font-display font-bold text-ochre mb-3">100%</div>
                <p className="text-xs font-mono text-ink">All prompts acknowledged on time.</p>
              </div>
              <div className="arcade-card p-6">
                <h3 className="smallcaps text-sand mb-2">Latest Mood</h3>
                <div className="text-3xl font-display font-bold text-ink mb-3">😊 Good</div>
                <p className="text-xs font-mono text-ink">Recorded at 8:30 AM.</p>
              </div>
            </div>

            <div className="arcade-card overflow-hidden">
              <div className="p-6 border-b-2 border-ink bg-kraft2 flex justify-between items-center">
                <h3 className="font-display font-bold uppercase text-ink tracking-widest text-sm">Recent Games</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-sm arcade-table">
                  <thead className="bg-ink text-kraft uppercase">
                    <tr>
                      <th className="p-3">Game</th>
                      <th className="p-3">Diff</th>
                      <th className="p-3">Acc</th>
                      <th className="p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-ink/10">
                    {patientSessions.slice(0, 5).map((s) => (
                      <tr key={s.id} className="hover:bg-kraft2">
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
        )}

        {activeTab === 'cognitive' && (
          <div className="space-y-8">
            <div className="arcade-card p-6">
              <div className="flex flex-col sm:flex-row justify-between mb-4">
                <h3 className="font-display font-bold uppercase tracking-widest text-ink">Performance Trend</h3>
                <div className="flex gap-6">
                  {(['7d', '30d', '3m'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setDateRange(r)}
                      className={`text-xs font-mono uppercase px-2 py-1 border-2 border-ink ${
                        dateRange === r ? 'bg-vermilion text-kraft' : 'bg-transparent text-ink hover:bg-kraft2'
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
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,21,18,0.08)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#675b4c', fontFamily: 'IBM Plex Mono' }} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: '#675b4c', fontFamily: 'IBM Plex Mono' }} />
                    <Tooltip contentStyle={{ background: '#e7dcc6', border: '2px solid #1a1512', borderRadius: 0, fontFamily: 'IBM Plex Mono' }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#e0451f" strokeWidth={3} dot={{ fill: '#e0451f', r: 4 }} />
                    <Line type="monotone" dataKey="benchmark" stroke="#d99a2b" strokeDasharray="5 5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="arcade-card p-6">
              <h3 className="font-display font-bold uppercase tracking-widest text-ink mb-4">Domain Score</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,21,18,0.08)" />
                    <XAxis dataKey="domain" tick={{ fontSize: 10, fill: '#675b4c', fontFamily: 'IBM Plex Mono' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#675b4c', fontFamily: 'IBM Plex Mono' }} />
                    <Tooltip contentStyle={{ background: '#e7dcc6', border: '2px solid #1a1512', borderRadius: 0, fontFamily: 'IBM Plex Mono' }} />
                    <Bar dataKey="score" fill="#2563eb" stroke="#1a1512" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="arcade-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-sm arcade-table">
                <thead className="bg-ink text-kraft uppercase">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Game</th>
                    <th className="p-3">Diff</th>
                    <th className="p-3">Acc</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Hints</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink/10">
                  {patientSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-kraft2">
                      <td className="p-3">{new Date(s.startedAt).toLocaleDateString()}</td>
                      <td className="p-3 uppercase">{s.gameId.replace('-', ' ')}</td>
                      <td className="p-3 uppercase">{s.difficulty}</td>
                      <td className="p-3 font-bold text-vermilion">{s.accuracy}%</td>
                      <td className="p-3">{Math.round(s.responseTimeMs / 1000)}s</td>
                      <td className="p-3">{s.hintsUsed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reminders.map((rem) => (
              <div key={rem.id} className="arcade-card p-6 flex flex-col justify-between h-full bg-kraft2">
                <div>
                   <span className="badge badge-ochre">{rem.type}</span>
                   <h4 className="font-bold font-mono text-ink text-base mt-2 uppercase">{rem.title}</h4>
                   <p className="text-sm font-mono text-sand mt-1">{rem.description}</p>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t-2 border-dashed border-ink/20 font-mono text-sm">
                   <Clock size={14} className="text-ink" />
                   <span className="text-ink">{rem.scheduledTime} DAILY</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'routine' && (
          <div className="arcade-card p-6">
            <h3 className="font-display font-bold uppercase tracking-widest text-ink mb-4">Daily Timeline</h3>
            <div className="space-y-3">
              {routineList.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-6 p-3 bg-kraft border-2 border-ink">
                  <span className="font-display font-bold text-sand text-xl w-6">{idx + 1}</span>
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-mono font-bold text-ink uppercase">{item.title}</h4>
                    <span className="smallcaps text-sand">{item.scheduledTime} • {item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-8">
            <form onSubmit={handleAddNote} className="arcade-card p-6 bg-kraft2">
              <h3 className="font-display font-bold uppercase tracking-widest text-ink mb-3 text-sm">Add Observation</h3>
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write a note..."
                rows={3}
                className="arcade-input w-full mb-3"
              />
              <button type="submit" className="btn btn-primary btn-sm">POST NOTE</button>
            </form>

            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="arcade-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-6">
                      <span className="font-mono font-bold uppercase text-ink">{note.authorName}</span>
                      <span className="badge bg-ink text-kraft">{note.authorRole}</span>
                    </div>
                    <span className="smallcaps text-sand">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-mono text-ink text-sm">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CaregiverPatientDetail;
