import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface GameInfo {
  id: string;
  name: string;
  subtitle: string;
  domain: string;
  time: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
  color: string;
}

const GAMES_LIST: GameInfo[] = [
  { id: 'memory-match', name: 'MEM MATCH', subtitle: 'Pair hidden cards', domain: 'Memory', time: '5 min', difficulty: 'easy', image: '/assets/images/memory_match_aesthetic_1790111728403.jpg', color: 'border-accent-blue' },
  { id: 'remember-objects', name: 'PIC MEMORY', subtitle: 'Recall items', domain: 'Memory', time: '4 min', difficulty: 'easy', image: '/assets/images/attention_aesthetic_1790111804475.jpg', color: 'border-accent-blue' },
  { id: 'sequence-memory', name: 'NUM MATCH', subtitle: 'Digit orders', domain: 'Attention', time: '2 min', difficulty: 'easy', image: '/assets/images/sudoku_aesthetic_1790111745958.jpg', color: 'border-accent-yellow' },
  { id: 'find-difference', name: 'FIND DIFF', subtitle: 'Spot details', domain: 'Attention', time: '5 min', difficulty: 'medium', image: '/assets/images/attention_aesthetic_1790111804475.jpg', color: 'border-accent-yellow' },
  { id: 'sort-my-day', name: 'SORT DAY', subtitle: 'Daily routines', domain: 'Orientation', time: '4 min', difficulty: 'easy', image: '/assets/images/jigsaw_aesthetic_1790111765563.jpg', color: 'border-accent-green' },
  { id: 'pattern-builder', name: 'PATTERN', subtitle: 'Geometric seq', domain: 'Reasoning', time: '4 min', difficulty: 'medium', image: '/assets/images/jigsaw_aesthetic_1790111765563.jpg', color: 'border-ink' },
  { id: 'attention-tap', name: 'ATTN TAP', subtitle: 'Visual reaction', domain: 'Processing', time: '3 min', difficulty: 'easy', image: '/assets/images/attention_aesthetic_1790111804475.jpg', color: 'border-accent-red' },
  { id: 'sound-memory', name: 'SOUND MEM', subtitle: 'Audio tones', domain: 'Memory', time: '5 min', difficulty: 'medium', image: '/assets/images/memory_match_aesthetic_1790111728403.jpg', color: 'border-accent-blue' },
  { id: 'story-memory', name: 'STORY MEM', subtitle: 'Read & recall', domain: 'Language', time: '6 min', difficulty: 'medium', image: '/assets/images/language_aesthetic_1790111791920.jpg', color: 'border-accent-red' },
  { id: 'object-recognition', name: 'WORD MATCH', subtitle: 'Connect words', domain: 'Language', time: '4 min', difficulty: 'easy', image: '/assets/images/language_aesthetic_1790111791920.jpg', color: 'border-accent-red' },
  { id: 'chess', name: 'CHESS', subtitle: 'Spatial tactics', domain: 'Reasoning', time: '10 min', difficulty: 'hard', image: '/assets/images/chess_aesthetic_1790111775100.jpg', color: 'border-ink' },
  { id: 'match3', name: 'GEM MATCH', subtitle: 'Swap jewels', domain: 'Processing', time: '5 min', difficulty: 'medium', image: '/assets/images/match3_aesthetic_1790111755965.jpg', color: 'border-accent-yellow' },
  { id: 'memory-game', name: 'CARD MEM', subtitle: 'Vintage recall', domain: 'Memory', time: '3 min', difficulty: 'easy', image: '/assets/images/memory_match_aesthetic_1790111728403.jpg', color: 'border-accent-blue' },
  { id: 'sudoku', name: 'SUDOKU', subtitle: 'Logic numbers', domain: 'Reasoning', time: '10 min', difficulty: 'hard', image: '/assets/images/sudoku_aesthetic_1790111745958.jpg', color: 'border-ink' },
  { id: 'jigsaw', name: 'JIGSAW', subtitle: 'Piece pictures', domain: 'Orientation', time: '5 min', difficulty: 'medium', image: '/assets/images/jigsaw_aesthetic_1790111765563.jpg', color: 'border-accent-green' },
];

export default function PatientGames() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-paper text-ink p-4 sm:p-8 md:p-12"
    >
      {/* Top Header Bar */}
      <div className="flex justify-between items-center font-mono text-[11px] tracking-[0.15em] uppercase font-semibold border-b-[3px] border-ink pb-3 mb-8">
        <div>NEURO MIND · CLINICAL ACTIVITIES</div>
        <div>SELECT A GAME</div>
      </div>

      {/* Main Title Area */}
      <div className="mb-16">
        <div className="mono-tag mb-4">A CATALOG OF COGNITIVE EXERCISES</div>
        <h1 className="font-display text-6xl sm:text-8xl md:text-[9rem] leading-[0.85] tracking-tight uppercase">
          NEURO<br />MIND
        </h1>
        <p className="font-sans text-lg sm:text-xl max-w-2xl mt-8 leading-relaxed font-medium">
          A collection of cognitive exercises designed for you. From matching cards to 
          reasoning with numbers. Every score and progress metric stays on this device.
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {GAMES_LIST.map((game, i) => (
          <button
            key={game.id}
            onClick={() => navigate(`/patient/game/${game.id}`)}
            className={`group flex flex-col text-left bg-paper border-[3px] border-ink border-t-[8px] ${game.color} hover:bg-[#e3decf] transition-colors relative overflow-hidden cursor-pointer`}
          >
            {/* Top row: Number and Image */}
            <div className="flex justify-between items-start p-5">
              <div className="font-mono text-sm tracking-widest font-semibold">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="w-14 h-14 border-2 border-ink overflow-hidden group-hover:scale-105 transition-transform">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>

            {/* Title & Description */}
            <div className="px-5 pb-5 flex-1 flex flex-col justify-end">
              <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-tight mb-2">
                {game.name}
              </h3>
              <div className="mono-tag text-accent-red mb-3">
                {game.domain} · {game.difficulty}
              </div>
              <p className="font-sans text-sm leading-relaxed opacity-80 h-10 line-clamp-2">
                {game.subtitle}. Enjoy {game.time} of focus.
              </p>
            </div>

            {/* Bottom Stats */}
            <div className="border-t-2 border-ink px-5 py-3 font-mono text-[10px] tracking-widest uppercase flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
              <span>No scores yet</span>
              <span>Level 1</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
