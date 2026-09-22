import { motion } from 'framer-motion';

export default function PatientProgress() {
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
      <div className="relative w-full h-40 mb-6 flex items-end justify-between px-2 overflow-hidden rounded-3xl bg-gradient-to-b from-[#FDFBF7] to-[#eef6f0]">
        
        {/* Sky / Sun */}
        <div className="absolute top-4 left-20 w-12 h-12 bg-yellow-200 rounded-full blur-[1px] opacity-80"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#e0eee5] rounded-t-full scale-150 translate-y-8"></div>

        {/* Abstract Watering Can */}
        <div className="relative z-10 w-16 h-12 mb-2 translate-x-2">
           <div className="absolute bottom-0 left-2 w-12 h-10 bg-teal-600 rounded-xl rounded-tr-sm"></div>
           <div className="absolute top-1 -right-2 w-8 h-2 bg-teal-500 rounded-full rotate-[-30deg]"></div>
           <div className="absolute top-3 -right-4 w-2 h-2 bg-sky-300 rounded-full"></div>
           <div className="absolute top-5 -right-3 w-1.5 h-1.5 bg-sky-300 rounded-full"></div>
           <div className="absolute top-4 -right-6 w-2 h-2 bg-sky-300 rounded-full"></div>
           <div className="absolute top-2 -left-2 w-4 h-6 border-2 border-teal-600 rounded-l-full"></div>
        </div>

        {/* Abstract Growing Tree */}
        <div className="relative z-10 w-24 h-32 mr-2">
           {/* Trunk */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-12 bg-[#8B5A2B] rounded-sm"></div>
           {/* Leaves */}
           <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#5E947A] rounded-full shadow-sm"></div>
           <div className="absolute top-0 right-2 w-16 h-16 bg-[#75A586] rounded-full shadow-sm"></div>
           <div className="absolute top-8 left-0 w-14 h-14 bg-[#4A856E] rounded-full shadow-sm"></div>
        </div>
      </div>

      {/* Cognitive Progress List */}
      <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center mb-5">
           <h3 className="font-bold text-[15px] text-stone-900">Cognitive Progress</h3>
           <span className="text-[11px] font-bold text-stone-400">&lt;-|&gt;</span>
        </div>

        <div className="space-y-5">
          {cognitiveProgress.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${item.color} ${item.text} flex items-center justify-center text-lg shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[13px] font-bold text-stone-900 leading-none">{item.domain}</span>
                  <span className="text-[13px] font-bold text-stone-900 leading-none">{item.score}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.barColor} rounded-full`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
