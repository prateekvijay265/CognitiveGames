import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, User, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function PatientHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const patientName = user?.name || 'Abhishek';
  const firstName = patientName.split(' ')[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const completedCount = 3;
  const totalCount = 5;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-4 pb-24 font-sans"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-stone-500 font-medium text-sm">{getGreeting()},</h2>
          <h1 className="text-[28px] font-bold text-stone-900 leading-tight mb-0.5">
            {firstName} <span className="inline-block origin-bottom-right animate-wave text-2xl">👋</span>
          </h1>
          <p className="text-stone-500 text-xs font-medium">Let's give your brain a little workout.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/patient/settings')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 bg-transparent active:bg-stone-100 transition-colors"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={() => navigate('/patient/settings')}
            className="w-9 h-9 rounded-full overflow-hidden bg-sky-100 flex items-center justify-center border-2 border-white shadow-sm active:scale-95 transition-transform"
          >
            <User size={18} className="text-sky-700" />
          </button>
        </div>
      </div>

      {/* BANNER (Today's Brain Journey) */}
      <div className="relative overflow-hidden rounded-3xl bg-life-gradient text-white p-6 mb-8 shadow-[0_8px_32px_rgba(255,138,101,0.3)] min-h-[160px] flex flex-col justify-end group hover-lift cursor-pointer">
        
        {/* Animated organic shapes in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Sun/Light orb */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-200/50 rounded-full blur-[20px] animate-blob"></div>
          
          {/* Glowing floating shapes */}
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl rotate-12 animate-float shadow-[0_0_15px_rgba(255,255,255,0.4)] border border-white/30"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/30 rounded-full animate-float-rotate animation-delay-2000 blur-[1px]"></div>
          
          {/* Shimmer effect that sweeps across on hover */}
          <div className="hover-shimmer"></div>
        </div>
        
        {/* Banner Content */}
        <div className="relative z-10 glass-card p-4 rounded-2xl border border-white/40">
          <div className="flex justify-between items-end">
            <div className="flex-1 mr-4">
              <h3 className="font-bold text-base mb-1 text-stone-900">Today's Brain Journey</h3>
              <p className="text-stone-600 text-[11px] font-semibold mb-3">{completedCount} / {totalCount} games completed</p>
              
              <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden shadow-inner border border-white/40">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-rose-400 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                  style={{ width: `${progressPercent}%` }}
                >
                   {/* Mini shimmer inside the progress bar */}
                   <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
            
            <button className="w-11 h-11 shrink-0 rounded-full bg-white text-orange-500 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] group-hover:scale-110 group-active:scale-95 transition-all duration-300">
              <ArrowRight size={22} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK GAMES SECTION */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[17px] text-stone-900">Quick Games</h3>
          <button 
            onClick={() => navigate('/patient/games')}
            className="text-[11px] font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-orange-100 transition-colors"
          >
            See all <ChevronRight size={14} className="stroke-[2.5]" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-5 px-5 snap-x hide-scrollbar">
          
          {/* Card 1: Remember the picture */}
          <button 
            onClick={() => navigate('/patient/game/remember-objects')}
            className="w-[150px] flex-shrink-0 glass rounded-3xl p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] snap-start text-left hover-lift hover-shimmer group"
          >
            <div className="w-full aspect-square rounded-[1.25rem] bg-gradient-to-br from-rose-100 to-orange-100 mb-3 flex items-center justify-center relative overflow-hidden group-hover:shadow-inner transition-all">
              {/* Flower Icon Abstraction */}
              <div className="relative grid grid-cols-2 gap-0.5 rotate-12 scale-110 group-hover:scale-125 group-hover:rotate-45 transition-transform duration-500">
                 <div className="w-6 h-6 rounded-full bg-rose-400 mix-blend-multiply"></div>
                 <div className="w-6 h-6 rounded-full bg-orange-400 mix-blend-multiply"></div>
                 <div className="w-6 h-6 rounded-full bg-pink-400 mix-blend-multiply"></div>
                 <div className="w-6 h-6 rounded-full bg-amber-400 mix-blend-multiply"></div>
                 <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-white border-2 border-rose-200"></div>
              </div>
            </div>
            <h4 className="font-bold text-[13px] text-stone-900 leading-tight mb-3">Remember the Picture</h4>
            <div className="flex items-center justify-between mt-auto">
               <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md">Memory</span>
               <span className="text-[10px] font-semibold text-stone-400">~2 min</span>
            </div>
          </button>
          
          {/* Card 2: Number Match */}
          <button 
            onClick={() => navigate('/patient/game/sequence-memory')}
            className="w-[150px] flex-shrink-0 glass rounded-3xl p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] snap-start text-left hover-lift hover-shimmer group"
          >
            <div className="w-full aspect-square rounded-[1.25rem] bg-gradient-to-br from-blue-100 to-indigo-100 mb-3 flex items-center justify-center relative overflow-hidden group-hover:shadow-inner transition-all">
              {/* Number Icon Abstraction */}
              <div className="relative flex gap-2 group-hover:scale-110 transition-transform duration-500">
                 <div className="w-9 h-11 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-lg -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">1</div>
                 <div className="w-9 h-11 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">3</div>
              </div>
            </div>
            <h4 className="font-bold text-[13px] text-stone-900 leading-tight mb-3">Number Match</h4>
            <div className="flex items-center justify-between mt-auto">
               <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-500 rounded-md">Attention</span>
               <span className="text-[10px] font-semibold text-stone-400">~2 min</span>
            </div>
          </button>

          {/* Card 3: Complete the Pattern */}
          <button 
            onClick={() => navigate('/patient/game/pattern-builder')}
            className="w-[150px] flex-shrink-0 glass rounded-3xl p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] snap-start text-left hover-lift hover-shimmer group"
          >
            <div className="w-full aspect-square rounded-[1.25rem] bg-gradient-to-br from-amber-100 to-yellow-100 mb-3 flex items-center justify-center relative overflow-hidden group-hover:shadow-inner transition-all">
              {/* Pattern Icon Abstraction */}
              <div className="relative flex flex-col gap-0 items-center group-hover:scale-110 transition-transform duration-500">
                 <div className="w-10 h-10 rounded-full bg-amber-400 shadow-md -mb-3 z-10 translate-x-2 border-2 border-white group-hover:-translate-x-2 transition-transform duration-500"></div>
                 <div className="w-11 h-11 rounded-xl bg-yellow-400 shadow-md rotate-12 -translate-x-2 border-2 border-white group-hover:translate-x-2 group-hover:-rotate-12 transition-transform duration-500"></div>
              </div>
            </div>
            <h4 className="font-bold text-[13px] text-stone-900 leading-tight mb-3">Complete the Pattern</h4>
            <div className="flex items-center justify-between mt-auto">
               <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md">Reasoning</span>
               <span className="text-[10px] font-semibold text-stone-400">~4 min</span>
            </div>
          </button>

        </div>
      </div>

      {/* EXPLORE YOUR DAY (Restored Tabs) */}
      <div className="mb-6 relative z-10">
        <h3 className="font-bold text-[17px] text-stone-900 mb-4">Explore Your Day</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Routine */}
          <button 
            onClick={() => navigate('/patient/routine')}
            className="glass p-4 rounded-[1.25rem] shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left flex flex-col gap-2 hover-lift group hover-shimmer"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">🌅</div>
            <h4 className="font-bold text-[14px] text-stone-900">My Day</h4>
          </button>
          
          {/* Reminders */}
          <button 
            onClick={() => navigate('/patient/reminders')}
            className="glass p-4 rounded-[1.25rem] shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left flex flex-col gap-2 hover-lift group hover-shimmer"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-400 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">🔔</div>
            <h4 className="font-bold text-[14px] text-stone-900">Reminders</h4>
          </button>
          
          {/* Memory Book */}
          <button 
            onClick={() => navigate('/patient/memory-book')}
            className="glass p-4 rounded-[1.25rem] shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left flex flex-col gap-2 hover-lift group hover-shimmer"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-400 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">📖</div>
            <h4 className="font-bold text-[14px] text-stone-900">Memory Book</h4>
          </button>
          
          {/* Help */}
          <button 
            onClick={() => navigate('/patient/help')}
            className="glass p-4 rounded-[1.25rem] shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left flex flex-col gap-2 hover-lift group hover-shimmer"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">🤝</div>
            <h4 className="font-bold text-[14px] text-stone-900">Support</h4>
          </button>
        </div>
      </div>
      
    </motion.div>
  );
}
