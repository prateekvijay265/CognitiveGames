import { useAppDataStore } from '@/store/appDataStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { voiceService } from '@/services/voice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VoiceButton } from '@/components/ui/VoiceButton';
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
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const { t } = useTranslation();
  const todayFormatted = formatDate(new Date());

  const [reminders, setReminders] = useState<ReminderItemState[]>(() =>
    DEMO_REMINDERS.map((rem, idx) => ({
      id: rem.id,
      type: rem.type,
      title: rem.title,
      description: rem.description || '',
      scheduledTime: rem.scheduledTime,
      // Mark earlier morning reminder done as realistic demo state
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
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 patient-mode"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm">
        <div className="space-y-1">
          <span className="text-sm font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {todayFormatted}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight pt-1">
            {t('reminders.title', 'My Reminders')}
          </h1>
          <p className="text-lg text-stone-600 font-medium">
            {pendingCount === 0
              ? t('reminders.all_done', 'All reminders completed!')
              : `${pendingCount} ${pendingCount === 1 ? 'item' : 'items'} remaining today`}
          </p>
        </div>

        <VoiceButton
          size="lg"
          onClick={speakAllPending}
          showLabel
          label={t('help.repeat', 'Listen')}
        />
      </div>

      {/* REMINDER ITEMS LIST */}
      <div className="space-y-4">
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
                className={`p-5 sm:p-7 rounded-3xl border-2 transition-all duration-200 shadow-xs ${
                  isDone
                    ? 'bg-stone-50/80 border-stone-200 opacity-80'
                    : 'bg-white border-teal-200/80 hover:border-teal-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  {/* Left: Icon, Time, Title */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 border text-4xl sm:text-5xl select-none ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-teal-50/70 border-teal-200 text-teal-800'
                      }`}
                    >
                      {isDone ? '✅' : icon}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-extrabold text-teal-800 flex items-center gap-1.5">
                          <Clock className="w-5 h-5 text-teal-600" />
                          {formatReminderTime(reminder.scheduledTime)}
                        </span>
                        {reminder.status === 'snoozed' && (
                          <Badge variant="warning" size="sm">
                            Snoozed
                          </Badge>
                        )}
                      </div>

                      <h2
                        className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                          isDone ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {reminder.title}
                      </h2>

                      {reminder.description && (
                        <p className="text-base sm:text-lg text-stone-500 font-normal">
                          {reminder.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row sm:flex-col items-center justify-end gap-3 shrink-0 pt-2 sm:pt-0">
                    {isDone ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100/70 text-emerald-800 font-bold text-lg">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <span>Done!</span>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => handleMarkDone(reminder.id, reminder.title)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg min-h-[3.5rem] px-6 shadow-md active:scale-95 flex-1 sm:flex-initial w-full"
                        >
                          <Check className="w-6 h-6 mr-1.5 stroke-[3]" />
                          <span>{t('reminders.done', 'Done')}</span>
                        </Button>

                        <Button
                          variant="secondary"
                          size="md"
                          onClick={() => handleSnooze(reminder.id, reminder.title)}
                          className="text-amber-800 border-amber-300 hover:bg-amber-50 font-semibold text-base min-h-[3rem] px-4 flex-1 sm:flex-initial w-full"
                        >
                          <RotateCcw className="w-4 h-4 mr-1.5" />
                          <span>{t('reminders.remind_later', 'Remind Later')}</span>
                        </Button>
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
