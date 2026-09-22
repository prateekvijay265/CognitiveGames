import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Target, Sparkles, Brain, Clock, Bell, Map, Phone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function PatientHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] || 'Asha';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full font-sans flex flex-col gap-12"
    >
      {/* 🚀 Massive Desktop Header */}
      <header className="flex items-end justify-between border-b-[3px] border-ink pb-6">
        <div>
          <h2 className="font-mono text-lg font-bold tracking-widest text-sand uppercase mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-vermilion" /> {getGreeting()}
          </h2>
          <h1 className="text-6xl font-display font-black text-ink uppercase tracking-wider">
            {firstName} <span className="inline-block origin-bottom-right animate-wave text-5xl">👋</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="font-mono text-sand text-lg font-bold uppercase tracking-widest mb-2">Daily Progress</p>
          <div className="flex items-center gap-4">
            <div className="w-64 h-6 bg-kraft2 border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] overflow-hidden">
              <div className="h-full bg-vermilion border-r-[3px] border-ink w-[60%]" />
            </div>
            <span className="font-display font-bold text-2xl text-ink">60%</span>
          </div>
        </div>
      </header>

      {/* 📜 Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Games */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-3xl uppercase tracking-widest text-ink flex items-center gap-3">
              <Brain size={32} className="text-vermilion stroke-[2.5]" />
              Quick Games
            </h3>
            <button 
              onClick={() => navigate('/patient/games')}
              className="font-mono font-bold uppercase tracking-widest text-sm bg-kraft2 border-[3px] border-ink px-6 py-3 shadow-[4px_4px_0_var(--color-ink)] hover:bg-vermilion hover:text-kraft hover:translate-x-1 transition-all flex items-center gap-2"
            >
              View Arcade <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { id: 'match3', name: 'Match 3', icon: '💎', color: 'bg-vermilion', stat: 'Processing' },
              { id: 'sudoku', name: 'Sudoku', icon: '🔢', color: 'bg-ochre', stat: 'Logic' },
              { id: 'jigsaw', name: 'Jigsaw', icon: '🧩', color: 'bg-blue-500', stat: 'Visual' }
            ].map(game => (
              <button
                key={game.id}
                onClick={() => navigate(`/patient/games/${game.id}`)}
                className="group flex flex-col items-center bg-kraft border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] hover:shadow-[8px_8px_0_var(--color-ink)] hover:-translate-y-1 transition-all"
              >
                <div className={`w-full aspect-square ${game.color} border-b-[3px] border-ink flex items-center justify-center text-7xl group-hover:scale-105 transition-transform`}>
                  {game.icon}
                </div>
                <div className="p-4 w-full text-center">
                  <div className="font-display font-bold text-xl uppercase tracking-widest text-ink mb-1">{game.name}</div>
                  <div className="font-mono font-bold text-xs uppercase tracking-widest text-sand">{game.stat}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Explore */}
        <div className="flex flex-col gap-8">
          <h3 className="font-display font-bold text-3xl uppercase tracking-widest text-ink flex items-center gap-3">
            <Target size={32} className="text-ochre stroke-[2.5]" />
            Your Day
          </h3>
          
          <div className="flex flex-col gap-6">
            <button className="w-full flex items-center gap-6 p-6 bg-kraft2 border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] hover:-translate-y-1 transition-all text-left group">
              <div className="w-16 h-16 bg-blue-400 border-[3px] border-ink flex items-center justify-center text-3xl shadow-[4px_4px_0_var(--color-ink)] group-hover:bg-vermilion transition-colors">
                🌅
              </div>
              <div>
                <div className="font-display font-bold text-2xl uppercase tracking-widest text-ink">My Day</div>
                <div className="font-mono text-sm font-bold tracking-widest text-sand uppercase">Daily Routine</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-6 p-6 bg-kraft2 border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] hover:-translate-y-1 transition-all text-left group">
              <div className="w-16 h-16 bg-pink-400 border-[3px] border-ink flex items-center justify-center text-3xl shadow-[4px_4px_0_var(--color-ink)] group-hover:bg-vermilion transition-colors">
                📸
              </div>
              <div>
                <div className="font-display font-bold text-2xl uppercase tracking-widest text-ink">Memories</div>
                <div className="font-mono text-sm font-bold tracking-widest text-sand uppercase">View Photo Album</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-6 p-6 bg-kraft2 border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] hover:-translate-y-1 transition-all text-left group">
              <div className="w-16 h-16 bg-emerald-400 border-[3px] border-ink flex items-center justify-center text-3xl shadow-[4px_4px_0_var(--color-ink)] group-hover:bg-vermilion transition-colors">
                <Bell size={28} className="text-ink stroke-[2.5]" />
              </div>
              <div>
                <div className="font-display font-bold text-2xl uppercase tracking-widest text-ink">Alerts</div>
                <div className="font-mono text-sm font-bold tracking-widest text-sand uppercase">2 Reminders</div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
