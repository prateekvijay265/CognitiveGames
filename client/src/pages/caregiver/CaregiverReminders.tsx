import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Clock, Volume2, Vibrate, ShieldCheck, User } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Reminder, ReminderType } from '../../types';

export function CaregiverReminders() {
  const { patients: DEMO_PATIENTS, reminders: DEMO_REMINDERS } = useAppDataStore();

  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0]?.id || '');
  const [reminders, setReminders] = useState<Reminder[]>(DEMO_REMINDERS);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReminderType>('medicine');
  const [newTime, setNewTime] = useState('08:00');
  const [newDesc, setNewDesc] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [caregiverNotify, setCaregiverNotify] = useState(true);

  if (DEMO_PATIENTS.length === 0) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <EmptyState title="NO PATIENTS" description="Add a patient to start managing reminders." />
      </div>
    );
  }

  const patientReminders = reminders.filter((r) => r.patientId === selectedPatientId);

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Reminder = {
      id: `rem-${Date.now()}`,
      patientId: selectedPatientId,
      type: newType,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      scheduledTime: newTime,
      repeatSchedule: { type: 'daily' },
      voiceEnabled,
      soundEnabled,
      vibrationEnabled,
      caregiverNotify,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setReminders([...reminders, created]);
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">Caregiver • Schedule</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Reminders
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Configure time-sensitive prompts.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary btn-sm flex items-center gap-6 self-start sm:self-auto"
        >
          <Plus size={16} /> {showAddForm ? 'CANCEL' : 'NEW REMINDER'}
        </button>
      </div>

      <div className="arcade-card p-6 bg-kraft2 flex items-center gap-6">
        <User size={16} className="text-ink" />
        <span className="smallcaps text-ink">PATIENT:</span>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="arcade-select py-1 min-w-[200px]"
        >
          {DEMO_PATIENTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name.toUpperCase()} (AGE {p.age})
            </option>
          ))}
        </select>
      </div>

      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleCreateReminder}
          className="arcade-card p-6 bg-kraft overflow-hidden space-y-8 border-l-4 border-l-vermilion"
        >
          <h3 className="font-display font-bold text-ink uppercase tracking-widest mb-4">Schedule Reminder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="smallcaps text-sand block mb-1">TITLE</label>
              <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="arcade-input w-full" placeholder="e.g. WATER" />
            </div>
            <div>
              <label className="smallcaps text-sand block mb-1">TYPE</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value as ReminderType)} className="arcade-select w-full">
                <option value="medicine">MEDICINE</option>
                <option value="hydration">HYDRATION</option>
                <option value="activity">ACTIVITY</option>
                <option value="meal">MEAL</option>
                <option value="exercise">EXERCISE</option>
                <option value="sleep">SLEEP</option>
              </select>
            </div>
            <div>
              <label className="smallcaps text-sand block mb-1">TIME</label>
              <input type="time" required value={newTime} onChange={(e) => setNewTime(e.target.value)} className="arcade-input w-full" />
            </div>
          </div>
          <div>
            <label className="smallcaps text-sand block mb-1">NOTES</label>
            <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="arcade-input w-full" placeholder="Optional details..." />
          </div>
          
          <div className="flex flex-wrap gap-6 pt-4 border-t-2 border-ink/20">
            <label className="flex items-center gap-6 cursor-pointer font-mono text-sm text-ink uppercase">
              <input type="checkbox" checked={voiceEnabled} onChange={e => setVoiceEnabled(e.target.checked)} className="accent-vermilion" />
              <Volume2 size={16} /> VOICE
            </label>
            <label className="flex items-center gap-6 cursor-pointer font-mono text-sm text-ink uppercase">
              <input type="checkbox" checked={vibrationEnabled} onChange={e => setVibrationEnabled(e.target.checked)} className="accent-vermilion" />
              <Vibrate size={16} /> VIBRATE
            </label>
            <label className="flex items-center gap-6 cursor-pointer font-mono text-sm text-ink uppercase">
              <input type="checkbox" checked={caregiverNotify} onChange={e => setCaregiverNotify(e.target.checked)} className="accent-vermilion" />
              <ShieldCheck size={16} /> NOTIFY ME
            </label>
          </div>

          <div className="flex justify-end gap-6 pt-4">
            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-ghost">CANCEL</button>
            <button type="submit" className="btn btn-primary">SAVE</button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patientReminders.map((rem, i) => (
          <div key={rem.id} className="arcade-card p-6 flex flex-col justify-between animate-fade-up bg-kraft" style={{ animationDelay: `${i*100}ms` }}>
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="badge badge-ochre">{rem.type}</span>
                <button onClick={() => handleDeleteReminder(rem.id)} className="text-sand hover:text-vermilion transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="font-display font-bold text-ink text-lg uppercase tracking-widest">{rem.title}</h3>
              {rem.description && <p className="font-mono text-sand text-sm mt-2">{rem.description}</p>}
            </div>

            <div className="mt-4 pt-4 border-t-2 border-dashed border-ink/20 flex items-center justify-between font-mono text-sm">
              <div className="flex items-center gap-6 text-ink font-bold">
                <Clock size={14} /> {rem.scheduledTime}
              </div>
              <div className="flex items-center gap-6 text-vermilion">
                {rem.voiceEnabled && <Volume2 size={14} />}
                {rem.vibrationEnabled && <Vibrate size={14} />}
              </div>
            </div>
          </div>
        ))}
        {patientReminders.length === 0 && !showAddForm && (
          <div className="col-span-full arcade-card p-8 text-center bg-kraft2">
            <p className="font-mono text-sand">No reminders scheduled for this patient.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CaregiverReminders;
