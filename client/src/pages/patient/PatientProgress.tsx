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
    { domain: 'Memory', score: 82, icon: '🧠', color: 'bg-rose-100', text: 'text-rose-500', barColor: 'bg-[#4A856E]' },
    { domain: 'Attention', score: 67, icon: '👁️', color: 'bg-sky-100', text: 'text-sky-500', barColor: 'bg-teal-400' },
    { domain: 'Language', score: 74, icon: '💬', color: 'bg-orange-100', text: 'text-orange-500', barColor: 'bg-yellow-400' },
    { domain: 'Reasoning', score: 58, icon: '🧩', color: 'bg-fuchsia-100', text: 'text-fuchsia-500', barColor: 'bg-purple-400' },
    { domain: 'Orientation', score: 71, icon: '📍', color: 'bg-emerald-100', text: 'text-emerald-500', barColor: 'bg-sky-400' },
    { domain: 'Processing', score: 63, icon: '⚡', color: 'bg-violet-100', text: 'text-violet-500', barColor: 'bg-indigo-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-6 pb-28 font-sans bg-[#FDFBF7] min-h-screen"
    >
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-[26px] font-bold text-stone-900 leading-tight mb-1">
          Your Brain Garden
        </h1>
        <p className="text-stone-500 text-sm font-medium">Small steps. Big progress.</p>
      </div>

      {/* Illustration Area */}
      <div className="relative w-full h-44 mb-6 flex items-end justify-between px-4 overflow-hidden rounded-3xl bg-hope-gradient shadow-[0_8px_32px_rgba(20,184,166,0.15)] group">
        
        {/* Animated Sky / Sun */}
        <div className="absolute top-4 left-20 w-16 h-16 bg-yellow-300 rounded-full blur-[4px] opacity-90 animate-blob glow-accent"></div>
        <div className="absolute top-10 right-10 w-24 h-12 bg-white/40 rounded-full blur-[8px] animate-float animation-delay-2000"></div>
        
        {/* Rolling Hills (Base) */}
        <div className="absolute bottom-0 left-[-20%] right-[-20%] h-20 bg-gradient-to-t from-teal-500/20 to-teal-100/50 rounded-t-[100%]"></div>
        <div className="absolute bottom-[-10px] left-[-10%] right-[-10%] h-16 bg-gradient-to-t from-teal-600/30 to-teal-200/60 rounded-t-[100%]"></div>

        {/* Floating animated 'leaves' or particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-float-rotate shadow-[0_0_8px_rgba(45,212,191,0.8)]"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-emerald-400 rounded-full animate-float-rotate animation-delay-2000 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
          <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-float shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
        </div>

        {/* Abstract Watering Can */}
        <div className="relative z-10 w-16 h-12 mb-3 translate-x-2 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
           <div className="absolute bottom-0 left-2 w-12 h-10 bg-teal-500 rounded-xl rounded-tr-sm shadow-md"></div>
           <div className="absolute top-1 -right-2 w-8 h-2 bg-teal-400 rounded-full rotate-[-30deg]"></div>
           <div className="absolute top-4 -right-4 w-2 h-2 bg-sky-300 rounded-full animate-bounce-in"></div>
           <div className="absolute top-6 -right-3 w-1.5 h-1.5 bg-sky-300 rounded-full animate-bounce-in" style={{ animationDelay: '200ms' }}></div>
           <div className="absolute top-5 -right-6 w-2 h-2 bg-sky-300 rounded-full animate-bounce-in" style={{ animationDelay: '400ms' }}></div>
           <div className="absolute top-2 -left-2 w-4 h-6 border-2 border-teal-500 rounded-l-full"></div>
        </div>

        {/* Abstract Growing Tree */}
        <div className="relative z-10 w-28 h-36 mr-2 group-hover:scale-105 transition-transform duration-700 origin-bottom">
           {/* Pulse aura around tree */}
           <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-teal-400/20 rounded-full animate-pulse-ring"></div>
           
           {/* Trunk */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-14 bg-amber-700/90 rounded-sm shadow-inner"></div>
           {/* Leaves */}
           <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-full shadow-lg border border-white/20"></div>
           <div className="absolute top-0 right-2 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-lg border border-white/20"></div>
           <div className="absolute top-8 -left-2 w-14 h-14 bg-gradient-to-br from-emerald-300 to-teal-500 rounded-full shadow-lg border border-white/20"></div>
        </div>
      </div>

      {/* Cognitive Progress List */}
      <div className="mb-8 relative z-10">
        <h3 className="font-bold text-[17px] text-stone-900 mb-4">Cognitive Domains</h3>
        <div className="space-y-3">
          {cognitiveProgress.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-3.5 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center gap-4 hover-lift hover-shimmer group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl ${item.color} ${item.text} flex items-center justify-center text-xl shrink-0 shadow-sm border border-white/50 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[14px] text-stone-900">{item.domain}</h4>
                  <span className="text-[12px] font-bold text-stone-500">{item.score}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                    className={`h-full ${item.barColor} rounded-full relative overflow-hidden`}
                  >
                     <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Chart (Restored) */}
      <div className="mt-6 bg-white rounded-3xl p-5 border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center mb-5">
           <h3 className="font-bold text-[15px] text-stone-900">Activity This Week</h3>
           <span className="text-[11px] font-bold text-[#4A856E] bg-[#4A856E]/10 px-2 py-1 rounded-full">24 Completed</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fill: '#A8A29E', fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#A8A29E', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#F5F5F4' }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Bar dataKey="count" fill="#4A856E" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
