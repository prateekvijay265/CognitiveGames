import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatientProgress() {
  const weeklyData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 4 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 5 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: 6 },
    { day: 'Sun', count: 3 },
  ];
  const cognitiveProgress = [
    { domain: 'Memory', score: 82, icon: '🧠', bg: 'bg-vermilion', text: 'text-kraft' },
    { domain: 'Attention', score: 67, icon: '👁️', bg: 'bg-ochre', text: 'text-ink' },
    { domain: 'Language', score: 74, icon: '💬', bg: 'bg-sand', text: 'text-kraft' },
    { domain: 'Reasoning', score: 58, icon: '🧩', bg: 'bg-ink', text: 'text-kraft' },
    { domain: 'Orientation', score: 71, icon: '📍', bg: 'bg-vermilion', text: 'text-kraft' },
    { domain: 'Processing', score: 63, icon: '⚡', bg: 'bg-ochre', text: 'text-ink' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 lg:p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="smallcaps text-sand mb-1">Overview • Activity</div>
          <h1 className="font-display font-bold text-ink text-2xl lg:text-3xl uppercase tracking-widest">
            Your Brain Garden
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">Small steps. Big progress.</p>
        </div>
      </div>

      {/* Cognitive Progress List */}
      <div>
        <h3 className="font-display uppercase tracking-widest text-ink mb-4 font-bold">Cognitive Domains</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cognitiveProgress.map((item, idx) => (
            <div key={idx} className="arcade-card p-4 flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center text-2xl border-2 border-ink ${item.bg} ${item.text} shadow-[2px_2px_0px_rgba(26,21,18,1)]`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-ink">{item.domain}</h4>
                  <span className="font-mono text-sm font-bold text-ink">{item.score}%</span>
                </div>
                <div className="arcade-progress">
                  <div 
                    className="arcade-progress-bar bg-vermilion" 
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="arcade-card p-5">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-display uppercase tracking-widest text-ink font-bold">Activity This Week</h3>
           <span className="badge badge-ochre">24 Completed</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fill: '#1a1512', fontSize: 11, fontFamily: 'IBM Plex Mono', fontWeight: 'bold' }}
                axisLine={{ stroke: '#1a1512', strokeWidth: 2 }}
                tickLine={false}
                dy={10}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#1a1512', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#d8caae' }}
                contentStyle={{
                  backgroundColor: '#e7dcc6',
                  borderRadius: '0',
                  border: '2px solid #1a1512',
                  boxShadow: '4px 4px 0px rgba(26,21,18,1)',
                  fontSize: '12px',
                  fontFamily: 'IBM Plex Mono',
                  fontWeight: 'bold',
                }}
              />
              <Bar dataKey="count" fill="#e0451f" stroke="#1a1512" strokeWidth={2} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
