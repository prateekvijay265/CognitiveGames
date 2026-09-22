import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DOMAINS = [
  { domain: 'Memory',      score: 82, icon: '🧠', color: 'bg-vermilion text-kraft' },
  { domain: 'Attention',   score: 67, icon: '🎯', color: 'bg-ochre text-ink'       },
  { domain: 'Language',    score: 74, icon: '💬', color: 'bg-sand text-kraft'       },
  { domain: 'Reasoning',   score: 58, icon: '🧩', color: 'bg-ink text-kraft'        },
  { domain: 'Orientation', score: 71, icon: '🗺️', color: 'bg-vermilion text-kraft' },
  { domain: 'Processing',  score: 63, icon: '⚡', color: 'bg-ochre text-ink'        },
];

const WEEKLY = [
  { day: 'Mon', count: 3 },
  { day: 'Tue', count: 4 },
  { day: 'Wed', count: 2 },
  { day: 'Thu', count: 5 },
  { day: 'Fri', count: 4 },
  { day: 'Sat', count: 6 },
  { day: 'Sun', count: 3 },
];

const SCORE_COLOR = (s: number) =>
  s >= 75 ? 'bg-ochre' : s >= 55 ? 'bg-vermilion' : 'bg-ink';

export default function PatientProgress() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 pt-6 pb-8 space-y-8"
    >
      {/* Header */}
      <div>
        <p className="smallcaps text-sand mb-1">Overview · Activity</p>
        <h1 className="font-display font-bold text-ink text-2xl uppercase tracking-widest">
          Brain Garden
        </h1>
        <p className="font-mono text-sand text-xs mt-1">Small steps. Big progress.</p>
      </div>

      {/* Cognitive Domain Cards */}
      <div>
        <h3 className="font-display uppercase tracking-widest text-ink mb-4 font-bold text-sm">
          Cognitive Domains
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {DOMAINS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="arcade-card p-4 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 flex-shrink-0 flex items-center justify-center text-2xl border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] ${item.color}`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-ink text-sm">{item.domain}</span>
                  <span className="font-mono text-sm font-bold text-ink">{item.score}%</span>
                </div>
                <div className="arcade-progress">
                  <div
                    className={`arcade-progress-bar ${SCORE_COLOR(item.score)}`}
                    style={{ width: `${item.score}%`, transition: 'width 0.8s ease' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="arcade-card p-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display uppercase tracking-widest text-ink font-bold text-sm">
            Activity This Week
          </h3>
          <span className="badge badge-ochre">24 Completed</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fill: '#1a1512', fontSize: 11, fontFamily: 'IBM Plex Mono', fontWeight: 700 }}
                axisLine={{ stroke: '#1a1512', strokeWidth: 2 }}
                tickLine={false}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#675b4c', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(216,202,174,0.5)' }}
                contentStyle={{
                  background: '#e7dcc6',
                  border: '2px solid #1a1512',
                  borderRadius: 0,
                  boxShadow: '4px 4px 0 #1a1512',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
              <Bar dataKey="count" fill="#e0451f" stroke="#1a1512" strokeWidth={2} barSize={28} radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Streak',   value: '7',   unit: 'days'  },
          { label: 'Sessions', value: '24',  unit: 'total' },
          { label: 'Avg Score', value: '69', unit: '%'     },
        ].map((stat) => (
          <div key={stat.label} className="arcade-card p-4 text-center">
            <div className="font-display font-black text-ink text-3xl leading-none">{stat.value}</div>
            <div className="smallcaps text-sand mt-1">{stat.unit}</div>
            <div className="font-mono text-ink/50 text-[10px] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
