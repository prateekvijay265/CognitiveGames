import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

export default function PatientHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-paper text-ink p-4 sm:p-8 md:p-12"
    >
      {/* Top Header Bar */}
      <div className="flex justify-between items-center font-mono text-[11px] tracking-[0.15em] uppercase font-semibold border-b-[3px] border-ink pb-3 mb-8">
        <div>COGNITIVE SUITE · DAILY REGIMEN</div>
        <div>PROGRESS · 60%</div>
      </div>

      {/* Main Title Area */}
      <div className="mb-16 border-b-[3px] border-ink pb-12">
        <div className="mono-tag mb-4">NEURO MIND · DAILY REGIMEN</div>
        <h1 className="font-display text-6xl sm:text-8xl md:text-[9rem] leading-[0.85] tracking-tight uppercase">
          WELCOME<br />{firstName}
        </h1>
        <p className="font-sans text-lg sm:text-xl max-w-2xl mt-8 leading-relaxed font-medium">
          Continue your cognitive exercises, review your memory book, 
          and check your daily routine. Everything you need is right here.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="font-display text-4xl uppercase tracking-tight">Activities</h2>
            <button 
              onClick={() => navigate('/patient/games')}
              className="font-mono text-xs uppercase font-bold tracking-widest hover:text-accent-red transition-colors"
            >
              VIEW ALL &rarr;
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { id: 'match3', name: 'GEMS', tag: 'Processing', color: 'border-accent-yellow', image: '/assets/images/match3_aesthetic_1790111755965.jpg' },
              { id: 'sudoku', name: 'SUDOKU', tag: 'Reasoning', color: 'border-ink', image: '/assets/images/sudoku_aesthetic_1790111745958.jpg' },
              { id: 'jigsaw', name: 'DIE-CUT', tag: 'Orientation', color: 'border-accent-red', image: '/assets/images/jigsaw_aesthetic_1790111765563.jpg' }
            ].map((game, i) => (
              <button
                key={game.id}
                onClick={() => navigate(`/patient/game/${game.id}`)}
                className={`group flex flex-col text-left bg-paper border-[3px] border-ink border-t-[8px] ${game.color} hover:bg-[#e3decf] transition-colors relative overflow-hidden cursor-pointer`}
              >
                <div className="flex justify-between items-start p-4 border-b-2 border-ink">
                  <span className="font-mono text-sm tracking-widest font-semibold">0 {i+1}</span>
                  <div className="w-10 h-10 border-2 border-ink overflow-hidden group-hover:scale-105 transition-transform">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0" />
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mb-2 mt-auto">{game.name}</h3>
                  <div className="mono-tag text-accent-red">{game.tag}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Routine & Reminders */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-4xl uppercase tracking-tight mb-2">Schedule</h2>
          
          <div className="flex flex-col gap-0 border-[3px] border-ink bg-paper">
            <button 
              onClick={() => navigate('/patient/routine')}
              className="w-full flex items-center justify-between p-5 border-b-2 border-ink hover:bg-[#e3decf] transition-colors text-left group"
            >
              <div>
                <div className="font-display text-2xl uppercase mb-1">Daily Routine</div>
                <div className="font-mono text-xs text-ink/70 uppercase tracking-widest">Morning tea, medicines</div>
              </div>
              <span className="font-mono text-lg">&rarr;</span>
            </button>

            <button 
              onClick={() => navigate('/patient/memory-book')}
              className="w-full flex items-center justify-between p-5 border-b-2 border-ink hover:bg-[#e3decf] transition-colors text-left group"
            >
              <div>
                <div className="font-display text-2xl uppercase mb-1">Memory Book</div>
                <div className="font-mono text-xs text-ink/70 uppercase tracking-widest">Photos & Stories</div>
              </div>
              <span className="font-mono text-lg">&rarr;</span>
            </button>

            <button 
              onClick={() => navigate('/patient/reminders')}
              className="w-full flex items-center justify-between p-5 hover:bg-[#e3decf] transition-colors text-left group"
            >
              <div>
                <div className="font-display text-2xl uppercase mb-1">Reminders</div>
                <div className="font-mono text-xs text-ink/70 uppercase tracking-widest">Active Alerts</div>
              </div>
              <span className="font-mono text-lg">&rarr;</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
