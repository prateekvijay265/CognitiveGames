import { useAppDataStore } from '@/store/appDataStore';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, CheckCircle2, Sun, Sunset, Moon, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { voiceService } from '@/services/voice';
import { toast } from 'sonner';

type Period = 'morning' | 'afternoon' | 'evening' | 'night';

const PERIOD_CONFIG: Record<
  Period,
  { label: string; icon: React.ReactNode; bg: string }
> = {
  morning: {
    label: 'Morning',
    icon: <Sun className="w-6 h-6" />,
    bg: 'bg-ochre',
  },
  afternoon: {
    label: 'Afternoon',
    icon: <Coffee className="w-6 h-6" />,
    bg: 'bg-vermilion',
  },
  evening: {
    label: 'Evening',
    icon: <Sunset className="w-6 h-6" />,
    bg: 'bg-sand',
  },
  night: {
    label: 'Night',
    icon: <Moon className="w-6 h-6" />,
    bg: 'bg-ink',
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
  const { routines: DEMO_ROUTINE } = useAppDataStore();
  const { t } = useTranslation();
  const todayFormatted = formatDate(new Date());

  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
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
    const text = `Today is ${todayFormatted}. You have completed ${completedIds.size} of ${DEMO_ROUTINE.length} routine steps.`;
    voiceService.speak(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="smallcaps text-sand mb-1">{todayFormatted}</div>
          <h1 className="font-display font-bold text-ink text-2xl lg:text-3xl uppercase tracking-widest">
            {t('routine.title', 'My Day')}
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            {completedIds.size} of {DEMO_ROUTINE.length} routine steps completed
          </p>
        </div>
        <button className="btn btn-primary" onClick={speakRoutine}>Listen</button>
      </div>

      {/* TIMELINE PERIODS */}
      <div className="space-y-8 max-w-3xl">
        {periods.map((period) => {
          const items = DEMO_ROUTINE.filter((r) => r.category === period);
          if (items.length === 0) return null;

          const config = PERIOD_CONFIG[period];
          const periodLabel = t(`routine.${period}`, config.label);
          const headerTextColor = period === 'night' ? 'text-kraft' : 'text-ink';

          return (
            <div key={period} className="space-y-4">
              {/* Period Header */}
              <div
                className={`flex items-center gap-3 px-4 py-2 border-2 border-ink shadow-[2px_2px_0px_rgba(26,21,18,1)] w-fit ${config.bg} ${headerTextColor}`}
              >
                {config.icon}
                <h2 className="text-xl font-bold font-display uppercase tracking-widest">
                  {periodLabel}
                </h2>
              </div>

              {/* Routine Items */}
              <div className="space-y-4">
                {items.map((item) => {
                  const isDone = completedIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`arcade-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isDone ? 'opacity-70 bg-kraft2' : 'bg-kraft'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-12 h-12 flex items-center justify-center border-2 border-ink bg-white text-2xl shadow-[2px_2px_0px_rgba(26,21,18,1)]" role="img" aria-label={item.title}>
                          {item.icon}
                        </span>

                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-ink flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {formatTime(item.scheduledTime)}
                          </span>

                          <h3
                            className={`text-xl font-bold font-display uppercase tracking-widest ${
                              isDone ? 'line-through text-ink/70' : 'text-ink'
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="w-full sm:w-auto">
                        {isDone ? (
                          <button
                            type="button"
                            onClick={() => toggleDone(item.id, item.title)}
                            className="btn btn-ghost w-full sm:w-auto flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Done</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleDone(item.id, item.title)}
                            className="btn btn-primary w-full sm:w-auto"
                          >
                            <Check className="w-5 h-5 mr-1" />
                            {t('routine.mark_done', 'Mark Done')}
                          </button>
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
