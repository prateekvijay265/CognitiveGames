import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Volume2,
  Vibrate,
  ShieldCheck,
  User,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Reminder, ReminderType } from '../../types';


export function CaregiverReminders() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0]?.id || '');
  const [reminders, setReminders] = useState<Reminder[]>(DEMO_REMINDERS);
  const [showAddForm, setShowAddForm] = useState(false);

  // New reminder form fields
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReminderType>('medicine');
  const [newTime, setNewTime] = useState('08:00');
  const [newDesc, setNewDesc] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  if (DEMO_PATIENTS.length === 0) {
    return (
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto mt-16 lg:mt-0 flex items-center justify-center">
        <EmptyState
          title="No Patients Found"
          description="You don't have any patients assigned yet. Add a patient to start managing reminders."
        />
      </div>
    );
  }
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [caregiverNotify, setCaregiverNotify] = useState(true);

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Reminders & Daily Schedule
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Configure time-sensitive prompts for medication, hydration, and gentle activity.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Cancel' : 'New Reminder'}
        </button>
      </div>

      {/* Patient Selector Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3">
        <User className="w-4 h-4 text-stone-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Viewing Patient:
        </span>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="px-3 py-1.5 text-sm font-semibold bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-hidden"
        >
          {DEMO_PATIENTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Age {p.age})
            </option>
          ))}
        </select>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleCreateReminder}
          className="bg-white p-6 rounded-3xl border-2 border-teal-500/30 shadow-md space-y-4"
        >
          <h3 className="font-bold text-stone-900 text-base">Schedule New Reminder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Afternoon Water"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full p-2.5 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">Category</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as ReminderType)}
                className="w-full p-2.5 text-sm rounded-xl border border-stone-200 focus:outline-hidden"
              >
                <option value="medicine">Medicine</option>
                <option value="hydration">Hydration</option>
                <option value="activity">Activity / Brain Game</option>
                <option value="meal">Meal</option>
                <option value="exercise">Exercise / Walk</option>
                <option value="sleep">Sleep / Rest</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">Time (HH:MM)</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
                className="w-full p-2.5 text-sm rounded-xl border border-stone-200 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              Instructions or Details (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Take 1 tablet with warm water"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-stone-200 focus:outline-hidden"
            />
          </div>

          {/* Accessibility & Notification Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-stone-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="rounded text-teal-600"
              />
              <Volume2 className="w-4 h-4 text-stone-500" /> Voice Readout
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={(e) => setVibrationEnabled(e.target.checked)}
                className="rounded text-teal-600"
              />
              <Vibrate className="w-4 h-4 text-stone-500" /> Vibration Alert
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caregiverNotify}
                onChange={(e) => setCaregiverNotify(e.target.checked)}
                className="rounded text-teal-600"
              />
              <ShieldCheck className="w-4 h-4 text-stone-500" /> Notify Caregiver if Missed
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Save Reminder
            </button>
          </div>
        </motion.form>
      )}

      {/* Reminder List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patientReminders.map((rem) => (
          <div
            key={rem.id}
            className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                  {rem.type}
                </span>
                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="text-stone-300 hover:text-rose-600 p-1 transition-colors"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-stone-900 text-base mt-2">{rem.title}</h3>
              {rem.description && (
                <p className="text-xs text-stone-500 mt-1">{rem.description}</p>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs font-semibold text-stone-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>{rem.scheduledTime}</span>
              </div>

              <div className="flex items-center gap-2 text-stone-400">
                {rem.voiceEnabled && <Volume2 className="w-3.5 h-3.5 text-teal-600" />}
                {rem.vibrationEnabled && <Vibrate className="w-3.5 h-3.5 text-teal-600" />}
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        ))}

        {patientReminders.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-400">
            No reminders scheduled for this patient yet.
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CaregiverReminders;
