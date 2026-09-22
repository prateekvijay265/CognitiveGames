import { useAppDataStore } from '@/store/appDataStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { voiceService } from '@/services/voice';
import { toast } from 'sonner';

type ReminderStatus = 'pending' | 'done' | 'snoozed';

interface ReminderItemState {
  id: string;
  type: string;
  title: string;
  description: string;
  scheduledTime: string;
  status: ReminderStatus;
}

const TYPE_ICONS: Record<string, string> = {
  medicine: '💊',
  hydration: '💧',
  meal: '🍽️',
  exercise: '🚶',
  appointment: '🩺',
  social: '👥',
  activity: '🎮',
  sleep: '🌙',
};

function formatReminderTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours)) return timeStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes ? String(minutes).padStart(2, '0') : '00';
  return `${displayHours}:${displayMinutes} ${period}`;
}

export default function PatientReminders() {
  const { reminders: DEMO_REMINDERS } = useAppDataStore();
  const { t } = useTranslation();
  const todayFormatted = formatDate(new Date());

  const [reminders, setReminders] = useState<ReminderItemState[]>(() =>
    DEMO_REMINDERS.map((rem, idx) => ({
      id: rem.id,
      type: rem.type,
      title: rem.title,
      description: rem.description || '',
      scheduledTime: rem.scheduledTime,
      status: idx === 0 ? 'done' : 'pending',
    }))
  );

  const handleMarkDone = async (id: string, title: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'done' as const } : r))
    );

    try {
      await db.reminderEvents.add({
        id: crypto.randomUUID(),
        reminderId: id,
        patientId: 'pat-1',
        scheduledAt: new Date().toISOString(),
        acknowledgedAt: new Date().toISOString(),
        status: 'done',
        syncStatus: 'synced',
      });
    } catch {
      // Offline fallback
    }

    toast.success(`Marked "${title}" as completed!`);
  };

  const handleSnooze = (id: string, title: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'snoozed' as const } : r))
    );
    toast.info(`We will remind you about "${title}" a little later.`);
  };

  const speakAllPending = () => {
    const pendingList = reminders.filter((r) => r.status === 'pending');
    if (pendingList.length === 0) {
      voiceService.speak(t('reminders.all_done', 'All reminders completed! Wonderful work today.'));
      return;
    }
    const text = `You have ${pendingList.length} reminders today. Next is ${
      pendingList[0].title
    } at ${formatReminderTime(pendingList[0].scheduledTime)}.`;
    voiceService.speak(text);
  };

  const pendingCount = reminders.filter((r) => r.status !== 'done').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 lg:p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">{todayFormatted}</div>
          <h1 className="font-display font-bold text-ink text-2xl lg:text-3xl uppercase tracking-widest">
            {t('reminders.title', 'My Reminders')}
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            {pendingCount === 0
              ? t('reminders.all_done', 'All reminders completed!')
              : `${pendingCount} ${pendingCount === 1 ? 'item' : 'items'} remaining today`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={speakAllPending}>Listen</button>
      </div>

      {/* REMINDER ITEMS LIST */}
      <div className="space-y-8 max-w-3xl">
        <AnimatePresence>
          {reminders.map((reminder) => {
            const icon = TYPE_ICONS[reminder.type] || '🔔';
            const isDone = reminder.status === 'done';

            return (
              <motion.div
                key={reminder.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`arcade-card p-6 ${isDone ? 'opacity-60 bg-kraft2' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Left: Icon, Time, Title */}
                  <div className="flex items-start gap-6 sm:gap-6">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0 border-2 border-ink text-4xl sm:text-5xl select-none ${
                        isDone ? 'bg-kraft3' : 'bg-ochre'
                      }`}
                    >
                      {isDone ? '✅' : icon}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-6">
                        <span className="font-mono font-bold text-ink flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {formatReminderTime(reminder.scheduledTime)}
                        </span>
                        {reminder.status === 'snoozed' && (
                          <span className="badge badge-sand">Snoozed</span>
                        )}
                      </div>

                      <h2
                        className={`text-xl sm:text-2xl font-bold font-display uppercase tracking-widest ${
                          isDone ? 'line-through text-ink/70' : 'text-ink'
                        }`}
                      >
                        {reminder.title}
                      </h2>

                      {reminder.description && (
                        <p className="text-base font-mono text-sand font-normal">
                          {reminder.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row sm:flex-col items-center justify-end gap-6 shrink-0 pt-2 sm:pt-0">
                    {isDone ? (
                      <div className="flex items-center gap-6 px-6 py-2 font-mono font-bold text-ink">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Done!</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleMarkDone(reminder.id, reminder.title)}
                          className="btn btn-primary w-full sm:w-auto"
                        >
                          <Check className="w-5 h-5 mr-1" />
                          {t('reminders.done', 'Done')}
                        </button>

                        <button
                          onClick={() => handleSnooze(reminder.id, reminder.title)}
                          className="btn btn-ghost w-full sm:w-auto"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          {t('reminders.remind_later', 'Remind Later')}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
