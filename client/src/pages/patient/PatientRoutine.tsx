import { useAppDataStore } from '@/store/appDataStore';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, CheckCircle2, Sun, Sunset, Moon, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { voiceService } from '@/services/voice';
import { Button } from '@/components/ui/Button';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { toast } from 'sonner';


type Period = 'morning' | 'afternoon' | 'evening' | 'night';

const PERIOD_CONFIG: Record<
  Period,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  morning: {
    label: 'Morning',
    icon: <Sun className="w-6 h-6 text-amber-500" />,
    color: 'text-amber-900',
    bg: 'bg-amber-50 border-amber-200',
  },
  afternoon: {
    label: 'Afternoon',
    icon: <Coffee className="w-6 h-6 text-orange-500" />,
    color: 'text-orange-900',
    bg: 'bg-orange-50 border-orange-200',
  },
  evening: {
    label: 'Evening',
    icon: <Sunset className="w-6 h-6 text-indigo-500" />,
    color: 'text-indigo-900',
    bg: 'bg-indigo-50 border-indigo-200',
  },
  night: {
    label: 'Night',
    icon: <Moon className="w-6 h-6 text-purple-500" />,
    color: 'text-purple-900',
    bg: 'bg-purple-50 border-purple-200',
  },
};

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours)) return timeStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes ? String(minutes).padStart(2, '0') : '00';
  return `${displayHours}:${displayMinutes} ${period}`;
}

export default function PatientRoutine() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const { t } = useTranslation();
  const todayFormatted = formatDate(new Date());

  // Store completed item IDs in state
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    // Default the first 2 morning items as completed for realistic demo
    return new Set(['r-1', 'r-2']);
  });

  const toggleDone = (id: string, title: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        toast.success(`Done: "${title}"`);
      }
      return next;
    });
  };

  const periods: Period[] = ['morning', 'afternoon', 'evening', 'night'];

  const speakRoutine = () => {
    const text = `Today is ${todayFormatted}. You have completed ${completedIds.size} of ${DEMO_ROUTINE.length} routine steps. Keep up the wonderful flow!`;
    voiceService.speak(text);
  };

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
            {t('routine.title', 'My Day')}
          </h1>
          <p className="text-lg text-stone-600 font-medium">
            {completedIds.size} of {DEMO_ROUTINE.length} routine steps completed
          </p>
        </div>

        <VoiceButton
          size="lg"
          onClick={speakRoutine}
          showLabel
          label={t('help.repeat', 'Listen')}
        />
      </div>

      {/* TIMELINE PERIODS */}
      <div className="space-y-6">
        {periods.map((period) => {
          const items = DEMO_ROUTINE.filter((r) => r.category === period);
          if (items.length === 0) return null;

          const config = PERIOD_CONFIG[period];
          const periodLabel = t(`routine.${period}`, config.label);

          return (
            <div key={period} className="space-y-3">
              {/* Period Header */}
              <div
                className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${config.bg} w-fit`}
              >
                {config.icon}
                <h2 className={`text-xl font-bold tracking-tight ${config.color}`}>
                  {periodLabel}
                </h2>
              </div>

              {/* Routine Items */}
              <div className="space-y-3">
                {items.map((item) => {
                  const isDone = completedIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-stone-50 border-stone-200 opacity-75'
                          : 'bg-white border-stone-200/80 hover:border-teal-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl select-none" role="img" aria-label={item.title}>
                          {item.icon}
                        </span>

                        <div className="space-y-0.5">
                          <span className="text-base font-bold text-teal-800 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-teal-600" />
                            {formatTime(item.scheduledTime)}
                          </span>

                          <h3
                            className={`text-2xl font-extrabold tracking-tight ${
                              isDone ? 'line-through text-stone-400' : 'text-stone-900'
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isDone ? (
                          <button
                            type="button"
                            onClick={() => toggleDone(item.id, item.title)}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-100/80 text-emerald-800 font-bold text-base cursor-pointer hover:bg-emerald-200 transition-colors"
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Done</span>
                          </button>
                        ) : (
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => toggleDone(item.id, item.title)}
                            className="font-bold text-base min-h-[3rem] px-5"
                          >
                            <Check className="w-5 h-5 mr-1 stroke-[3]" />
                            <span>{t('routine.mark_done', 'Mark Done')}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
