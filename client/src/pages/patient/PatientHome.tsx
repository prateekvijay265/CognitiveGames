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
      <div className="relative overflow-hidden rounded-3xl bg-[#4A856E] text-white p-6 mb-8 shadow-[0_8px_24px_rgba(74,133,110,0.25)] min-h-[140px] flex flex-col justify-end">
        {/* Abstract Nature Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Sun */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#FBE592] rounded-full blur-[2px] opacity-90"></div>
          
          {/* Light Green Hill (Back) */}
          <div className="absolute bottom-6 -left-4 w-48 h-24 bg-[#75A586] rounded-t-full rotate-[-15deg] opacity-80"></div>
          
          {/* Medium Green Hill (Right) */}
          <div className="absolute -bottom-4 -right-12 w-64 h-32 bg-[#5E947A] rounded-t-full rotate-[10deg]"></div>
          
          {/* Dark Green Ground (Front) */}
          <div className="absolute -bottom-10 -left-10 right-0 h-24 bg-[#3E705C] rounded-t-[50%] scale-x-125"></div>

          {/* Minimalist Trees */}
          <div className="absolute bottom-4 right-10 flex items-end gap-1">
             <div className="w-1.5 h-6 bg-[#355B49] rounded-sm relative">
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-6 bg-[#2B4B3C] rounded-full"></div>
             </div>
             <div className="w-1 h-4 bg-[#355B49] rounded-sm relative">
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-5 bg-[#2B4B3C] rounded-full"></div>
             </div>
          </div>
        </div>
        
        {/* Banner Content */}
        <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-bold text-base mb-1 text-white">Today's Brain Journey</h3>
              <p className="text-white/80 text-[10px] font-semibold mb-2">{completedCount} / {totalCount} games completed</p>
              
              <div className="w-32 h-2.5 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            
            <button className="w-10 h-10 rounded-full bg-white text-[#4A856E] flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <ArrowRight size={20} className="ml-0.5 stroke-[2.5]" />
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
            className="text-[11px] font-bold text-[#4A856E] flex items-center gap-0.5 active:opacity-70"
          >
            See all <ChevronRight size={14} className="stroke-[2.5]" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-5 px-5 snap-x hide-scrollbar">
          
          {/* Card 1: Remember the picture */}
          <button 
            onClick={() => navigate('/patient/game/remember-objects')}
            className="w-[150px] flex-shrink-0 bg-white rounded-3xl p-3.5 border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] snap-start text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-full aspect-square rounded-[1.25rem] bg-[#E3F2FD] mb-3 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5FAFF] to-[#D0E9FA] opacity-50"></div>
              {/* Flower Icon Abstraction */}
              <div className="relative grid grid-cols-2 gap-0.5 rotate-12 scale-110">
                 <div className="w-6 h-6 rounded-full bg-[#FF7E87]"></div>
                 <div className="w-6 h-6 rounded-full bg-[#FF7E87]"></div>
                 <div className="w-6 h-6 rounded-full bg-[#FF7E87]"></div>
                 <div className="w-6 h-6 rounded-full bg-[#FF7E87]"></div>
                 <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-[#FFD166] border-2 border-white"></div>
              </div>
            </div>
            <h4 className="font-bold text-[13px] text-stone-900 leading-tight mb-3">Remember the Picture</h4>
            <div className="flex items-center justify-between mt-auto">
               <span className="text-[9px] font-bold px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md">Memory</span>
               <span className="text-[10px] font-semibold text-stone-400">~2 min</span>
            </div>
          </button>
          
          {/* Card 2: Number Match */}
          <button 
            onClick={() => navigate('/patient/game/sequence-memory')}
            className="w-[150px] flex-shrink-0 bg-white rounded-3xl p-3.5 border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] snap-start text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-full aspect-square rounded-[1.25rem] bg-[#E8EAF6] mb-3 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F4F5F9] to-[#D5D8ED] opacity-50"></div>
              {/* Number Icon Abstraction */}
              <div className="relative flex gap-2">
                 <div className="w-9 h-11 rounded-lg bg-[#5C6BC0] text-white flex items-center justify-center font-bold text-lg shadow-sm">1</div>
                 <div className="w-9 h-11 rounded-lg bg-[#9575CD] text-white flex items-center justify-center font-bold text-lg shadow-sm">3</div>
              </div>
            </div>
            <h4 className="font-bold text-[13px] text-stone-900 leading-tight mb-3">Number Match</h4>
            <div className="flex items-center justify-between mt-auto">
               <span className="text-[9px] font-bold px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md">Attention</span>
               <span className="text-[10px] font-semibold text-stone-400">~2 min</span>
            </div>
          </button>

          {/* Card 3: Complete the Pattern */}
          <button 
            onClick={() => navigate('/patient/game/pattern-builder')}
            className="w-[150px] flex-shrink-0 bg-white rounded-3xl p-3.5 border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] snap-start text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-full aspect-square rounded-[1.25rem] bg-[#FFF3E0] mb-3 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F2] to-[#FFE0B2] opacity-50"></div>
              {/* Pattern Icon Abstraction */}
              <div className="relative flex flex-col gap-0 items-center">
                 <div className="w-10 h-10 rounded-full bg-[#FFB74D] shadow-sm -mb-3 z-10 translate-x-2 border-2 border-white/50"></div>
                 <div className="w-11 h-11 rounded-lg bg-[#FFA726] shadow-sm rotate-12 -translate-x-2 border-2 border-white/50"></div>
              </div>
            </div>
            <h4 className="font-bold text-[13px] text-stone-900 leading-tight mb-3">Complete the Pattern</h4>
            <div className="flex items-center justify-between mt-auto">
               <span className="text-[9px] font-bold px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md">Reasoning</span>
               <span className="text-[10px] font-semibold text-stone-400">~4 min</span>
            </div>
          </button>

        </div>
      </div>

      {/* EXPLORE YOUR DAY (Restored Tabs) */}
      <div className="mb-6">
        <h3 className="font-bold text-[17px] text-stone-900 mb-4">Explore Your Day</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Routine */}
          <button 
            onClick={() => navigate('/patient/routine')}
            className="bg-white p-4 rounded-[1.25rem] border border-stone-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left flex flex-col gap-2 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl">🌅</div>
            <h4 className="font-bold text-[14px] text-stone-900">My Day</h4>
          </button>
          
          {/* Reminders */}
          <button 
            onClick={() => navigate('/patient/reminders')}
            className="bg-white p-4 rounded-[1.25rem] border border-stone-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left flex flex-col gap-2 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center text-xl">🔔</div>
            <h4 className="font-bold text-[14px] text-stone-900">Reminders</h4>
          </button>
          
          {/* Memory Book */}
          <button 
            onClick={() => navigate('/patient/memory-book')}
            className="bg-white p-4 rounded-[1.25rem] border border-stone-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left flex flex-col gap-2 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xl">📖</div>
            <h4 className="font-bold text-[14px] text-stone-900">Memory Book</h4>
          </button>
          
          {/* Help */}
          <button 
            onClick={() => navigate('/patient/help')}
            className="bg-white p-4 rounded-[1.25rem] border border-stone-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left flex flex-col gap-2 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-xl">🤝</div>
            <h4 className="font-bold text-[14px] text-stone-900">Support</h4>
          </button>
        </div>
      </div>
      
    </motion.div>
  );
}
