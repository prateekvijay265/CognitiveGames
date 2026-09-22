import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GameInfo {
  id: string;
  name: string;
  domain: string;
  time: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const GAMES_LIST: GameInfo[] = [
  { id: 'memory-match', name: 'Memory Match', domain: 'Memory', time: '5 min', difficulty: 'easy' },
  { id: 'remember-objects', name: 'Remember the Picture', domain: 'Memory', time: '4 min', difficulty: 'easy' },
  { id: 'sequence-memory', name: 'Number Match', domain: 'Attention', time: '2 min', difficulty: 'easy' },
  { id: 'find-difference', name: 'Find the Difference', domain: 'Attention', time: '5 min', difficulty: 'medium' },
  { id: 'sort-my-day', name: 'Sort My Day', domain: 'Orientation', time: '4 min', difficulty: 'easy' },
  { id: 'pattern-builder', name: 'Complete the Pattern', domain: 'Reasoning', time: '4 min', difficulty: 'medium' },
  { id: 'attention-tap', name: 'Attention Tap', domain: 'Processing', time: '3 min', difficulty: 'easy' },
  { id: 'sound-memory', name: 'Sound Memory', domain: 'Memory', time: '5 min', difficulty: 'medium' },
  { id: 'story-memory', name: 'Story Memory', domain: 'Language', time: '6 min', difficulty: 'medium' },
  { id: 'object-recognition', name: 'Word Match', domain: 'Language', time: '4 min', difficulty: 'easy' },
  { id: 'chess', name: 'Chess', domain: 'Reasoning', time: '10 min', difficulty: 'hard' },
  { id: 'match3', name: 'Match 3', domain: 'Processing', time: '5 min', difficulty: 'medium' },
  { id: 'memory-game', name: 'Card Memory', domain: 'Memory', time: '3 min', difficulty: 'easy' },
  { id: 'sudoku', name: 'Sudoku', domain: 'Reasoning', time: '10 min', difficulty: 'hard' },
  { id: 'jigsaw', name: 'Jigsaw Puzzle', domain: 'Orientation', time: '5 min', difficulty: 'medium' },
];

const CATEGORIES = [
  { id: 'Memory', title: 'Memory', icon: '🧠', color: 'bg-rose-50 text-rose-500 border-rose-100', count: 5 },
  { id: 'Attention', title: 'Attention', icon: '🎯', color: 'bg-sky-50 text-sky-500 border-sky-100', count: 2 },
  { id: 'Reasoning', title: 'Reasoning', icon: '🧩', color: 'bg-fuchsia-50 text-fuchsia-500 border-fuchsia-100', count: 3 },
  { id: 'Language', title: 'Language', icon: '🗣️', color: 'bg-orange-50 text-orange-500 border-orange-100', count: 2 },
  { id: 'Orientation', title: 'Orientation', icon: '🧭', color: 'bg-emerald-50 text-emerald-500 border-emerald-100', count: 2 },
  { id: 'Processing', title: 'Processing', icon: '⚡', color: 'bg-violet-50 text-violet-500 border-violet-100', count: 2 },
];

export default function PatientGames() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredGames = selectedCategory 
    ? GAMES_LIST.filter(g => g.domain === selectedCategory)
    : [];

  return (
    <div className="px-5 pt-6 pb-24 font-sans min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <h1 className="text-[26px] font-display font-bold text-ink leading-tight mb-1 uppercase tracking-widest">
                  Arcade
                </h1>
                <p className="text-sand text-sm font-bold smallcaps">Choose a cognitive area</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((cat, idx) => (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="relative p-5 text-left group btn btn-ghost !border-ink shadow-[4px_4px_0_var(--color-ink)] hover:!shadow-[6px_6px_0_var(--color-ink)] transition-all flex flex-col items-start bg-kraft2/30"
                  >
                    <div className="text-3xl mb-4 relative z-10 group-hover:scale-110 transition-transform origin-bottom-left">{cat.icon}</div>
                    <h3 className="font-bold text-ink text-[15px] leading-tight mb-1">{cat.title}</h3>
                    <div className="flex justify-between items-center w-full">
                      <p className="smallcaps text-sand">{cat.count} games</p>
                      <ChevronRight className="w-4 h-4 text-ink opacity-60" />
                    </div>
                  </motion.button>
                ))}
              </div>
          </motion.div>
        ) : (
          <motion.div
            key="games-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="btn btn-ghost !p-2 !border-ink shadow-[2px_2px_0_var(--color-ink)]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-[22px] font-display font-bold text-ink leading-tight uppercase tracking-widest">{selectedCategory} Games</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredGames.length > 0 ? filteredGames.map((game, idx) => (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={game.id}
                  onClick={() => navigate(`/patient/game/${game.id}`)}
                  className="btn btn-ghost !border-ink shadow-[4px_4px_0_var(--color-ink)] flex w-full items-center justify-between text-left relative overflow-hidden bg-kraft2/50"
                >
                  <div className="relative z-10 flex-1">
                    <h4 className="font-display font-bold text-ink text-[16px] mb-1.5">{game.name}</h4>
                    <div className="flex gap-2">
                       <span className="smallcaps text-sand">{game.difficulty}</span>
                       <span className="smallcaps text-sand">⏱ {game.time}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-ink text-ink flex items-center justify-center shrink-0 shadow-[2px_2px_0_var(--color-ink)] group-hover:bg-vermilion group-hover:text-kraft transition-all duration-300 relative z-10">
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  </div>
                </motion.button>
              )) : (
                <p className="text-center text-sand text-sm py-10 font-mono">More games coming soon!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

// Internal icon for the category cards (since lucide doesn't have an exact match for the tiny chevron in the mockup)
function ChevronRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}
