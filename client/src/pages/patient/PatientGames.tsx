import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles, Gamepad2, Brain, Zap, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

interface GameInfo {
  id: string;
  name: string;
  domain: string;
  time: string;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
  icon: string;
}

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  'Memory': Brain,
  'Attention': Target,
  'Orientation': Sparkles,
  'Reasoning': Zap,
  'Processing': Gamepad2,
  'Language': Sparkles,
};

const GAMES_LIST: GameInfo[] = [
  { id: 'memory-match', name: 'Memory Match', domain: 'Memory', time: '5m', difficulty: 'easy', color: 'bg-emerald-500', icon: '/logo_memory_match.jpg' },
  { id: 'remember-objects', name: 'Picture Memory', domain: 'Memory', time: '4m', difficulty: 'easy', color: 'bg-emerald-400', icon: '/logo_remember_objects.jpg' },
  { id: 'sequence-memory', name: 'Number Match', domain: 'Attention', time: '2m', difficulty: 'easy', color: 'bg-amber-400', icon: '/logo_sequence_memory.jpg' },
  { id: 'find-difference', name: 'Find Difference', domain: 'Attention', time: '5m', difficulty: 'medium', color: 'bg-amber-500', icon: '/logo_find_difference.jpg' },
  { id: 'sort-my-day', name: 'Sort My Day', domain: 'Orientation', time: '4m', difficulty: 'easy', color: 'bg-blue-400', icon: '/logo_sort_my_day.jpg' },
  { id: 'pattern-builder', name: 'Pattern Builder', domain: 'Reasoning', time: '4m', difficulty: 'medium', color: 'bg-purple-500', icon: '/logo_pattern_builder.jpg' },
  { id: 'attention-tap', name: 'Attention Tap', domain: 'Processing', time: '3m', difficulty: 'easy', color: 'bg-vermilion', icon: '/logo_attention_tap.jpg' },
  { id: 'sound-memory', name: 'Sound Memory', domain: 'Memory', time: '5m', difficulty: 'medium', color: 'bg-emerald-600', icon: '/logo_sound_memory.jpg' },
  { id: 'story-memory', name: 'Story Memory', domain: 'Language', time: '6m', difficulty: 'medium', color: 'bg-pink-500', icon: '/logo_story_memory.jpg' },
  { id: 'object-recognition', name: 'Word Match', domain: 'Language', time: '4m', difficulty: 'easy', color: 'bg-pink-400', icon: '/logo_object_recognition.jpg' },
  { id: 'chess', name: 'Chess', domain: 'Reasoning', time: '10m', difficulty: 'hard', color: 'bg-slate-700', icon: '/logo_chess.jpg' },
  { id: 'match3', name: 'Match 3', domain: 'Processing', time: '5m', difficulty: 'medium', color: 'bg-fuchsia-500', icon: '/logo_match3.jpg' },
  { id: 'memory-game', name: 'Card Memory', domain: 'Memory', time: '3m', difficulty: 'easy', color: 'bg-emerald-500', icon: '/logo_memory_game.jpg' },
  { id: 'sudoku', name: 'Sudoku', domain: 'Reasoning', time: '10m', difficulty: 'hard', color: 'bg-ochre', icon: '/logo_sudoku.jpg' },
  { id: 'jigsaw', name: 'Jigsaw Puzzle', domain: 'Orientation', time: '5m', difficulty: 'medium', color: 'bg-blue-500', icon: '/logo_jigsaw.jpg' },
];

export default function PatientGames() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  
  const domains = ['all', ...Array.from(new Set(GAMES_LIST.map(g => g.domain)))];
  
  const filteredGames = filter === 'all' 
    ? GAMES_LIST 
    : GAMES_LIST.filter(g => g.domain === filter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full font-sans flex flex-col gap-10"
    >
      <header className="flex flex-col gap-6 border-b-[3px] border-ink pb-8">
        <h1 className="text-5xl font-display font-black text-ink uppercase tracking-wider flex items-center gap-4">
          <Gamepad2 size={48} className="text-vermilion" /> 
          Arcade Hub
        </h1>
        
        {/* Domain Filters */}
        <div className="flex flex-wrap gap-4">
          {domains.map(domain => (
            <button
              key={domain}
              onClick={() => setFilter(domain)}
              className={cn(
                'font-mono font-bold uppercase tracking-widest text-sm px-6 py-2 border-[3px] border-ink transition-all',
                filter === domain 
                  ? 'bg-ink text-kraft shadow-[4px_4px_0_var(--color-vermilion)] -translate-y-1' 
                  : 'bg-kraft2 text-ink shadow-[4px_4px_0_var(--color-ink)] hover:-translate-y-1 hover:bg-kraft hover:shadow-[6px_6px_0_var(--color-ink)]'
              )}
            >
              {domain}
            </button>
          ))}
        </div>
      </header>

      {/* Arcade Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-12">
        {filteredGames.map((game, i) => {
          const DomainIcon = DOMAIN_ICONS[game.domain] || Sparkles;
          return (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={game.id}
              onClick={() => navigate(`/patient/game/${game.id}`)}
              className="group flex flex-col text-left bg-kraft2 border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] hover:shadow-[10px_10px_0_var(--color-ink)] hover:-translate-y-2 transition-all relative overflow-hidden focus:outline-none"
            >
              {/* Difficulty Banner */}
              <div className={cn(
                'absolute top-0 right-0 px-3 py-1 border-b-[3px] border-l-[3px] border-ink font-mono font-bold text-[10px] uppercase tracking-widest z-10',
                game.difficulty === 'easy' ? 'bg-emerald-400' :
                game.difficulty === 'medium' ? 'bg-amber-400' : 'bg-vermilion text-kraft'
              )}>
                {game.difficulty}
              </div>

              {/* Game Icon Area */}
              <div className={cn(
                'w-full aspect-[4/3] flex items-center justify-center border-b-[3px] border-ink relative overflow-hidden',
                game.color
              )}>
                <img 
                  src={game.icon} 
                  alt={game.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                
                {/* Hover overlay with PLAY */}
                <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-vermilion text-kraft border-2 border-kraft p-4 rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Play size={32} className="ml-1" />
                  </div>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-5 flex flex-col flex-1 bg-kraft">
                <h3 className="font-display font-bold text-xl uppercase tracking-widest text-ink leading-tight mb-3">
                  {game.name}
                </h3>
                
                <div className="mt-auto flex items-center justify-between font-mono text-xs font-bold text-sand uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><DomainIcon size={14} /> {game.domain}</span>
                  <span>{game.time}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
