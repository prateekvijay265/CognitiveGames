import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Activity,
  Bell,
  MessageSquare,
  FileText,
  Info,
  Download,
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
  const { patients: DEMO_PATIENTS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const patient = DEMO_PATIENTS.find((p) => p.id === patientId) || DEMO_PATIENTS[0];

  if (!patient) {
    return (
      <div className="flex-1 p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="arcade-card p-8 text-center max-w-md">
          <h2 className="font-display text-2xl font-bold text-ink mb-4 uppercase">Patient Not Found</h2>
          <p className="font-mono text-sand mb-6">We couldn't find the requested patient profile.</p>
          <button onClick={() => navigate('/doctor/patients')} className="btn btn-primary">
            Back to Registry
          </button>
        </div>
      </div>
    );
  }

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
Neuro Mind - CLINICAL ACTIVITY & ENGAGEMENT REPORT
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      <button
        onClick={() => navigate('/doctor/patients')}
        className="nav-item flex items-center gap-6 w-fit text-kraft hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Registry
      </button>

      {/* Header Banner */}
      <div className="arcade-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[#7c3aed] border-4 border-ink flex items-center justify-center font-display font-bold text-white text-3xl shadow-[4px_4px_0px_rgba(26,21,18,1)]">
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-6">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink uppercase tracking-widest">{patient.name}</h1>
              <span className="badge bg-kraft2 text-ink uppercase">{patient.language}</span>
            </div>
            <p className="font-mono text-sand text-sm mt-2">
              Age: {patient.age} • Enrolled: July 2025 • Caregiver: Priya Sharma
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          className="btn"
          style={{ backgroundColor: '#7c3aed', color: 'white' }}
        >
          <Download className="w-4 h-4 inline mr-2" /> Download Summary
        </button>
      </div>

      {/* Disclaimer strip */}
      <div className="bg-amber-100 border-2 border-amber-400 p-3 flex items-center gap-6 text-xs text-ink font-mono uppercase">
        <Info className="w-5 h-5 text-amber-600 shrink-0" />
        <span>This report summarizes platform activity and is not a medical diagnosis.</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b-4 border-ink/20 overflow-x-auto no-scrollbar">
        {[
          { id: 'activity', label: 'Activity', icon: Activity },
          { id: 'reminders', label: 'Reminders', icon: Bell },
          { id: 'notes', label: 'Notes', icon: MessageSquare },
          { id: 'reports', label: 'Report', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`py-3 px-6 font-display font-bold uppercase tracking-widest flex items-center gap-6 border-b-4 transition-all whitespace-nowrap ${
              activeTab === id
                ? 'border-[#7c3aed] text-kraft'
                : 'border-transparent text-sand hover:text-kraft'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Activity Overview */}
      {activeTab === 'activity' && (
        <div className="space-y-8">
          <div className="arcade-card p-6">
            <h3 className="font-display font-bold text-ink text-lg uppercase tracking-widest mb-1">Cognitive Activity Trend</h3>
            <p className="font-mono text-xs text-sand mb-6">
              4-week observed accuracy over sequential cognitive gaming sessions.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,21,18,0.1)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#675b4c', fontSize: 12, fontFamily: 'monospace' }} />
                  <YAxis domain={[40, 100]} tick={{ fill: '#675b4c', fontSize: 12, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ background: '#e7dcc6', border: '2px solid #1a1512', borderRadius: 0, fontFamily: 'monospace', fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="observedAccuracy"
                    stroke="#7c3aed"
                    strokeWidth={4}
                    dot={{ fill: '#7c3aed', r: 5, strokeWidth: 2, stroke: '#1a1512' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#d99a2b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="arcade-card p-6">
            <h3 className="font-display font-bold text-ink text-lg uppercase tracking-widest mb-1">
              Observed Performance by Domain
            </h3>
            <p className="font-mono text-xs text-sand mb-6">
              Aggregated accuracy percentages across individual domains.
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,21,18,0.1)" vertical={false} />
                  <XAxis dataKey="domain" tick={{ fill: '#675b4c', fontSize: 12, fontFamily: 'monospace' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#675b4c', fontSize: 12, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ background: '#e7dcc6', border: '2px solid #1a1512', borderRadius: 0, fontFamily: 'monospace', fontSize: 12 }} />
                  <Bar dataKey="observedLevel" fill="#e0451f" stroke="#1a1512" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reminders */}
      {activeTab === 'reminders' && (
        <div className="space-y-8">
          <div className="arcade-card p-6">
            <h3 className="font-display font-bold text-ink text-lg uppercase tracking-widest mb-1">7-Day Adherence Percentage</h3>
            <p className="font-mono text-xs text-sand mb-6">
              Daily percentage of scheduled prompts acknowledged by patient.
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reminderAdherenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,21,18,0.1)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#675b4c', fontSize: 12, fontFamily: 'monospace' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#675b4c', fontSize: 12, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ background: '#e7dcc6', border: '2px solid #1a1512', borderRadius: 0, fontFamily: 'monospace', fontSize: 12 }} />
                  <Bar dataKey="adherence" fill="#d99a2b" stroke="#1a1512" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-8">
          <form
            onSubmit={handleAddObservation}
            className="arcade-card p-6 space-y-8"
          >
            <h3 className="font-display font-bold text-ink text-lg uppercase tracking-widest">Add Clinical Observation</h3>
            <textarea
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Record clinical impression, routine adjustments..."
              className="arcade-input w-full p-3 font-mono text-sm resize-none"
            />
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: '#7c3aed', color: 'white' }}
            >
              Post Observation
            </button>
          </form>

          <div className="space-y-8">
            {notes.map((note) => (
              <div key={note.id} className="arcade-card p-6 space-y-3">
                <div className="flex items-center justify-between border-b-2 border-ink border-dashed pb-2">
                  <div className="flex items-center gap-6">
                    <span className="font-display font-bold text-ink uppercase">{note.authorName}</span>
                    <span className="badge bg-kraft2 text-ink">
                      {note.authorRole}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-sand">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-mono text-sm text-ink leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Reports */}
      {activeTab === 'reports' && (
        <div className="paper grain border-4 border-ink p-8 shadow-[8px_8px_0px_rgba(26,21,18,1)] space-y-8">
          <div className="border-b-4 border-ink pb-4 flex justify-between items-end">
            <div>
              <h3 className="font-display font-bold text-ink text-2xl uppercase tracking-widest">Platform Clinical Summary</h3>
              <p className="font-mono text-sm text-sand mt-1">
                Print-ready documentation for patient medical files.
              </p>
            </div>
            <button
              onClick={handleDownloadReport}
              className="btn"
              style={{ backgroundColor: '#7c3aed', color: 'white' }}
            >
              <Download className="w-4 h-4 inline mr-2" /> Download Text Report
            </button>
          </div>

          <div className="p-6 bg-kraft2 border-2 border-ink font-mono text-sm text-ink space-y-8">
            <div className="flex justify-between border-b-2 border-ink/20 pb-2">
              <span className="font-bold">Patient:</span> <span>{patient.name} (Age {patient.age})</span>
            </div>
            <div className="flex justify-between border-b-2 border-ink/20 pb-2">
              <span className="font-bold">Observation Period:</span> <span>Past 4 Weeks</span>
            </div>
            <div className="flex justify-between border-b-2 border-ink/20 pb-2">
              <span className="font-bold">Platform Activities:</span> <span>48 sessions recorded</span>
            </div>
            <div className="flex justify-between border-b-2 border-ink/20 pb-2">
              <span className="font-bold">Average Domain Accuracy:</span> <span>82% (Consistent)</span>
            </div>
            <div className="flex justify-between border-b-2 border-ink/20 pb-2">
              <span className="font-bold">Reminder Adherence:</span> <span>92% (High)</span>
            </div>
            <div className="flex justify-between border-b-2 border-ink/20 pb-2">
              <span className="font-bold">Attending Clinician:</span> <span>Dr. Ananya Das</span>
            </div>
            <div className="pt-4 text-xs text-sand uppercase">
              Disclaimer: This report summarizes platform activity and is not a medical diagnosis.
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default DoctorPatientProfile;

