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
];

const CATEGORIES = [
  { id: 'Memory', title: 'Memory', icon: '🧠', color: 'bg-rose-50 text-rose-500 border-rose-100', count: 4 },
  { id: 'Attention', title: 'Attention', icon: '👁️', color: 'bg-sky-50 text-sky-500 border-sky-100', count: 2 },
  { id: 'Reasoning', title: 'Reasoning', icon: '🧩', color: 'bg-fuchsia-50 text-fuchsia-500 border-fuchsia-100', count: 1 },
  { id: 'Language', title: 'Language', icon: '💬', color: 'bg-orange-50 text-orange-500 border-orange-100', count: 2 },
  { id: 'Orientation', title: 'Orientation', icon: '📍', color: 'bg-emerald-50 text-emerald-500 border-emerald-100', count: 1 },
  { id: 'Processing', title: 'Processing', icon: '⚡', color: 'bg-violet-50 text-violet-500 border-violet-100', count: 1 },
];

export default function PatientGames() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredGames = selectedCategory 
    ? GAMES_LIST.filter(g => g.domain === selectedCategory)
    : [];

  return (
    <div className="px-5 pt-6 pb-24 font-sans bg-[#FDFBF7] min-h-full">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6">
              <h1 className="text-[26px] font-bold text-stone-900 leading-tight mb-1">
                Cognitive Areas
              </h1>
              <p className="text-stone-500 text-sm font-medium">Choose an area to focus on today.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative p-5 rounded-[1.25rem] border ${cat.color} text-left active:scale-95 transition-transform shadow-[0_2px_12px_rgba(0,0,0,0.02)]`}
                >
                  <div className="text-3xl mb-4">{cat.icon}</div>
                  <h3 className="font-bold text-stone-900 text-[15px] leading-tight mb-1">{cat.title}</h3>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[11px] font-semibold opacity-60 text-stone-700">{cat.count} games</p>
                    <ChevronRight className="w-4 h-4 text-stone-400 opacity-60" />
                  </div>
                </button>
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
                className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 active:bg-stone-100 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-[22px] font-bold text-stone-900 leading-tight">{selectedCategory} Games</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredGames.length > 0 ? filteredGames.map(game => (
                <button
                  key={game.id}
                  onClick={() => navigate(`/patient/game/${game.id}`)}
                  className="bg-white rounded-[1.25rem] p-4 border border-stone-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between active:scale-[0.98] transition-transform text-left"
                >
                  <div>
                    <h4 className="font-bold text-stone-900 text-[15px] mb-1.5">{game.name}</h4>
                    <div className="flex gap-2">
                       <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md uppercase tracking-wider">{game.difficulty}</span>
                       <span className="text-[10px] font-semibold text-stone-400 py-0.5">⏱ {game.time}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#E8F3EF] text-[#4A856E] flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  </div>
                </button>
              )) : (
                <p className="text-center text-stone-500 text-sm py-10">More games coming soon!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
