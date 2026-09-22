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
          <h2 className="smallcaps text-sand mb-1">{getGreeting()}</h2>
          <h1 className="text-[28px] font-display font-bold text-ink leading-tight mb-1 uppercase tracking-wider">
            {firstName} <span className="inline-block origin-bottom-right animate-wave text-2xl">👋</span>
          </h1>
          <p className="font-mono text-[13px] text-ink/70">Ready to play?</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/patient/settings')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] bg-kraft2 active:translate-y-px active:shadow-[1px_1px_0_var(--color-ink)] transition-all"
          >
            <Settings size={18} />
          </button>
          <button 
            onClick={() => navigate('/patient/settings')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-kraft border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] bg-vermilion active:translate-y-px active:shadow-[1px_1px_0_var(--color-ink)] transition-all"
          >
            <User size={18} />
          </button>
        </div>
      </div>

      {/* BANNER (Today's Brain Journey) */}
      <div className="paper rounded-[1.5rem] border-2 border-ink p-6 mb-8 shadow-[6px_6px_0_var(--color-ink)] flex flex-col justify-end group hover-lift cursor-pointer transition-all">
        
        <div className="relative z-10 w-full">
          <div className="flex justify-between items-end">
            <div className="flex-1 mr-4">
              <h3 className="font-display font-bold text-[18px] mb-2 text-ink uppercase tracking-widest">Daily Quest</h3>
              <p className="smallcaps text-sand mb-4">{completedCount} / {totalCount} completed</p>
              
              <div className="w-full h-4 bg-kraft2 rounded-full overflow-hidden border-2 border-ink shadow-inner">
                <div 
                  className="h-full bg-vermilion transition-all duration-1000 ease-out border-r-2 border-ink" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            
            <button className="w-12 h-12 shrink-0 rounded-full bg-felt text-kraft border-2 border-ink flex items-center justify-center shadow-[2px_2px_0_var(--color-ink)] group-hover:bg-ink transition-all">
              <ArrowRight size={22} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK GAMES SECTION */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-bold text-[17px] text-ink uppercase tracking-widest">Quick Games</h3>
          <button 
            onClick={() => navigate('/patient/games')}
            className="smallcaps text-ink bg-kraft2 px-3 py-1.5 border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] hover:bg-vermilion hover:text-kraft transition-all flex items-center gap-1 active:translate-y-px active:shadow-[1px_1px_0_var(--color-ink)]"
          >
            See all <ChevronRight size={14} className="stroke-[2.5]" />
          </button>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-5 px-5 snap-x hide-scrollbar">
          
          {/* Card 1: Match 3 */}
          <button 
            onClick={() => navigate('/patient/game/match3')}
            className="w-[150px] flex-shrink-0 btn btn-ghost !border-ink shadow-[4px_4px_0_var(--color-ink)] hover:!shadow-[6px_6px_0_var(--color-ink)] bg-kraft2/30 snap-start text-left flex flex-col items-start p-6 transition-all"
          >
            <div className="w-full aspect-square rounded-[1rem] bg-vermilion border-2 border-ink mb-3 flex items-center justify-center relative overflow-hidden shadow-inner group-hover:bg-ochre transition-all">
              <span className="text-3xl font-display text-kraft drop-shadow-md">💎</span>
            </div>
            <h4 className="font-display font-bold text-[14px] text-ink leading-tight mb-3">Match 3</h4>
            <div className="flex items-center justify-between mt-auto w-full">
               <span className="smallcaps text-sand">Process</span>
               <span className="smallcaps text-sand">5m</span>
            </div>
          </button>
          
          {/* Card 2: Sudoku */}
          <button 
            onClick={() => navigate('/patient/game/sudoku')}
            className="w-[150px] flex-shrink-0 btn btn-ghost !border-ink shadow-[4px_4px_0_var(--color-ink)] hover:!shadow-[6px_6px_0_var(--color-ink)] bg-kraft2/30 snap-start text-left flex flex-col items-start p-6 transition-all"
          >
            <div className="w-full aspect-square rounded-[1rem] bg-ochre border-2 border-ink mb-3 flex items-center justify-center relative overflow-hidden shadow-inner group-hover:bg-vermilion transition-all">
               <span className="text-3xl font-display text-kraft drop-shadow-md">🔢</span>
            </div>
            <h4 className="font-display font-bold text-[14px] text-ink leading-tight mb-3">Sudoku</h4>
            <div className="flex items-center justify-between mt-auto w-full">
               <span className="smallcaps text-sand">Reason</span>
               <span className="smallcaps text-sand">10m</span>
            </div>
          </button>

          {/* Card 3: Jigsaw */}
          <button 
            onClick={() => navigate('/patient/game/jigsaw')}
            className="w-[150px] flex-shrink-0 btn btn-ghost !border-ink shadow-[4px_4px_0_var(--color-ink)] hover:!shadow-[6px_6px_0_var(--color-ink)] bg-kraft2/30 snap-start text-left flex flex-col items-start p-6 transition-all"
          >
            <div className="w-full aspect-square rounded-[1rem] bg-sky-600 border-2 border-ink mb-3 flex items-center justify-center relative overflow-hidden shadow-inner group-hover:bg-indigo-600 transition-all">
               <span className="text-3xl font-display text-kraft drop-shadow-md">🧩</span>
            </div>
            <h4 className="font-display font-bold text-[14px] text-ink leading-tight mb-3">Jigsaw</h4>
            <div className="flex items-center justify-between mt-auto w-full">
               <span className="smallcaps text-sand">Orient</span>
               <span className="smallcaps text-sand">5m</span>
            </div>
          </button>
        </div>
      </div>

      {/* EXPLORE YOUR DAY (Restored Tabs) */}
      <div className="mb-6 relative z-10">
        <h3 className="font-display font-bold text-[17px] text-ink mb-4 uppercase tracking-widest">Explore Your Day</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Routine */}
          <button 
            onClick={() => navigate('/patient/routine')}
            className="btn btn-ghost !border-ink shadow-[4px_4px_0_var(--color-ink)] hover:!shadow-[6px_6px_0_var(--color-ink)] bg-kraft2/30 text-left flex flex-col items-start gap-6 p-6 transition-all w-full"
          >
            <div className="w-12 h-12 rounded-[1rem] bg-indigo-500 border-2 border-ink text-white flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">🌅</div>
            <h4 className="font-display font-bold text-[15px] text-ink">My Day</h4>
          </button>
          
          {/* Reminders */}
          <button 
            onClick={() => navigate('/patient/reminders')}
            className="btn btn-ghost !border-ink shadow-[4px_4px_0_var(--color-ink)] hover:!shadow-[6px_6px_0_var(--color-ink)] bg-kraft2/30 text-left flex flex-col items-start gap-6 p-6 transition-all w-full"
          >
            <div className="w-12 h-12 rounded-[1rem] bg-rose-500 border-2 border-ink text-white flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">🔔</div>
            <h4 className="font-display font-bold text-[15px] text-ink">Reminders</h4>
          </button>
          
          {/* Memory Book */}
          <button 
            onClick={() => navigate('/patient/memory')}
            className="btn btn-ghost !border-ink shadow-[4px_4px_0_var(--color-ink)] hover:!shadow-[6px_6px_0_var(--color-ink)] bg-kraft2/30 text-left flex flex-col items-start gap-6 p-6 transition-all w-full"
          >
            <div className="w-12 h-12 rounded-[1rem] bg-amber-500 border-2 border-ink text-white flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">📸</div>
            <h4 className="font-display font-bold text-[15px] text-ink">Memory Book</h4>
          </button>
          
          {/* Emergency / Help */}
          <button 
            onClick={() => navigate('/patient/help')}
            className="btn btn-ghost !border-ink shadow-[4px_4px_0_var(--color-ink)] hover:!shadow-[6px_6px_0_var(--color-ink)] bg-kraft2/30 text-left flex flex-col items-start gap-6 p-6 transition-all w-full"
          >
            <div className="w-12 h-12 rounded-[1rem] bg-emerald-500 border-2 border-ink text-white flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">❤️</div>
            <h4 className="font-display font-bold text-[15px] text-ink">Help</h4>
          </button>
        </div>
      </div>
      
    </motion.div>
  );
}
