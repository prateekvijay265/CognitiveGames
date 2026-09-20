import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardBody } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { VoiceButton } from '@/components/ui/VoiceButton';

export default function PatientProgress() {
  const { t } = useTranslation();

  // Weekly data aggregation
  const weeklyData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 4 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 5 },
    { day: 'Fri', count: 3 },
    { day: 'Sat', count: 4 },
    { day: 'Sun', count: 3 },
  ];

  const totalThisWeek = weeklyData.reduce((acc, curr) => acc + curr.count, 0);

  const domainScores = [
    { name: 'Memory Activities', domain: 'Memory', score: 85, color: 'bg-amber-500' },
    { name: 'Attention Activities', domain: 'Attention', score: 80, color: 'bg-teal-500' },
    { name: 'Pattern Activities', domain: 'Pattern', score: 88, color: 'bg-blue-500' },
    { name: 'Daily Routine', domain: 'Routine', score: 92, color: 'bg-emerald-500' },
  ];

  const spokenSummary = `Here is your activity progress. You have completed ${totalThisWeek} cognitive activities this week. Performance has remained steady and consistent. Wonderful effort!`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 patient-mode"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {t('nav.progress', 'Activity Progress')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight pt-1">
            {t('progress.title', 'My Progress')}
          </h1>
          <p className="text-lg text-stone-600 font-medium">
            Celebrating your cognitive activity and observed consistency
          </p>
        </div>

        <VoiceButton
          size="lg"
          textToSpeak={spokenSummary}
          showLabel
          label={t('help.repeat', 'Listen')}
        />
      </div>

      {/* ENCOURAGING MESSAGE BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shrink-0">
          🌟
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold leading-tight">
            {t('progress.great_week', 'Great week of activities!')}
          </h2>
          <p className="text-teal-50 text-base sm:text-lg leading-relaxed">
            {t(
              'progress.performance_consistent',
              'Performance has remained relatively consistent.'
            )}{' '}
            Keep enjoying your peaceful daily rhythm.
          </p>
        </div>
      </div>

      {/* TODAY'S COMPLETION & THIS WEEK CHART */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Ring Card */}
        <Card variant="elevated" padding="lg" className="flex flex-col items-center justify-center text-center">
          <CardBody className="pt-0 space-y-4">
            <h3 className="text-xl font-bold text-stone-900">{t('progress.today', 'Today')}</h3>
            <ProgressRing
              value={60}
              size={120}
              strokeWidth={11}
              color="#0d9488"
              trackColor="#e7e5e4"
              showPercent
            />
            <p className="text-base text-stone-600 font-medium">
              3 of 5 activities done today
            </p>
          </CardBody>
        </Card>

        {/* Weekly Activities Chart */}
        <Card variant="default" padding="lg" className="md:col-span-2">
          <CardBody className="pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="text-xl font-bold text-stone-900">
                  {t('progress.this_week', 'This Week')}
                </h3>
              </div>
              <span className="text-sm font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                {totalThisWeek} Completed
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#78716c', fontSize: 14, fontWeight: 600 }}
                    axisLine={{ stroke: '#e7e5e4' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#78716c', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#f5f5f4' }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e7e5e4',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.count >= 4 ? '#0d9488' : '#38bdf8'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* COGNITIVE ACTIVITY DOMAINS */}
      <Card variant="default" padding="lg">
        <CardBody className="pt-0 space-y-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <h3 className="text-2xl font-bold text-stone-900">
              Cognitive Activity Domains
            </h3>
          </div>

          <div className="space-y-4">
            {domainScores.map((item) => (
              <div key={item.domain} className="space-y-2">
                <div className="flex items-center justify-between text-base sm:text-lg font-bold">
                  <span className="text-stone-800">{item.name}</span>
                  <span className="text-teal-700">{item.score}%</span>
                </div>
                <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                  <motion.div
                    className={`h-full rounded-full ${item.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-stone-400 italic pt-2">
            Note: This overview reflects observed engagement and memory support activities. It is not a medical diagnosis.
          </p>
        </CardBody>
      </Card>
    </motion.div>
  );
}
