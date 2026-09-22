import React from 'react';

interface GameCardIllustrationProps {
  gameId: string;
  className?: string;
}

export const GameCardIllustration: React.FC<GameCardIllustrationProps> = ({ gameId, className = '' }) => {
  switch (gameId) {
    case 'memory-match':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          {/* Subtle floral pattern background */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-emerald-300/30 blur-lg pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-teal-300/30 blur-lg pointer-events-none" />
          
          {/* Paired Cards Illustration */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-14 h-20 bg-white rounded-xl shadow-md border-2 border-emerald-300 flex flex-col items-center justify-center p-2 transform -rotate-6 transition-transform group-hover:-rotate-12">
              <span className="text-2xl">🌸</span>
              <div className="w-6 h-1 bg-emerald-200 rounded-full mt-1.5" />
            </div>
            <div className="w-14 h-20 bg-white rounded-xl shadow-md border-2 border-emerald-300 flex flex-col items-center justify-center p-2 transform rotate-6 transition-transform group-hover:rotate-12">
              <span className="text-2xl">🌸</span>
              <div className="w-6 h-1 bg-emerald-200 rounded-full mt-1.5" />
            </div>
          </div>
          <span className="absolute bottom-2 right-2.5 text-[0.65rem] font-mono font-bold text-emerald-800/60 uppercase tracking-wider">Pairs</span>
        </div>
      );

    case 'remember-objects':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-18 h-18 bg-white/90 rounded-2xl shadow-md border-2 border-amber-300 flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform">
              🖼️
            </div>
            <div className="flex gap-1.5 mt-2">
              <span className="text-xs">🔑</span>
              <span className="text-xs">👓</span>
              <span className="text-xs">☕</span>
            </div>
          </div>
        </div>
      );

    case 'sequence-memory':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex items-center gap-2">
            {['1', '2', '3', '4'].map((num, i) => (
              <div
                key={num}
                className="w-8 h-10 bg-white rounded-lg shadow-sm border border-blue-300 flex items-center justify-center font-display font-bold text-blue-700 text-sm transform transition-all group-hover:-translate-y-1"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      );

    case 'find-difference':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-12 h-16 bg-white rounded-xl shadow-sm border border-orange-300 flex items-center justify-center text-lg">
              🌳
            </div>
            <div className="text-xl animate-pulse text-amber-700">🔍</div>
            <div className="w-12 h-16 bg-white rounded-xl shadow-sm border border-orange-300 flex items-center justify-center text-lg">
              🌲
            </div>
          </div>
        </div>
      );

    case 'sort-my-day':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-200/80 border border-amber-400 flex items-center justify-center text-lg shadow-xs">
                ☀️
              </div>
              <div className="w-3 h-0.5 bg-sky-300" />
              <div className="w-9 h-9 rounded-xl bg-sky-200/80 border border-sky-400 flex items-center justify-center text-lg shadow-xs">
                🍛
              </div>
              <div className="w-3 h-0.5 bg-sky-300" />
              <div className="w-9 h-9 rounded-xl bg-indigo-200/80 border border-indigo-400 flex items-center justify-center text-lg shadow-xs">
                🌙
              </div>
            </div>
          </div>
        </div>
      );

    case 'pattern-builder':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-purple-100 via-fuchsia-50 to-purple-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="grid grid-cols-2 gap-1.5 p-2 bg-white/80 rounded-xl shadow-sm border border-purple-300 relative z-10">
            <div className="w-7 h-7 bg-purple-500 rounded-md" />
            <div className="w-7 h-7 bg-amber-400 rounded-md" />
            <div className="w-7 h-7 bg-teal-400 rounded-md" />
            <div className="w-7 h-7 bg-rose-400 rounded-md border-2 border-dashed border-purple-400" />
          </div>
        </div>
      );

    case 'attention-tap':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-rose-100 via-orange-50 to-rose-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-400/20 flex items-center justify-center animate-ping absolute" />
            <div className="w-14 h-14 rounded-full bg-white shadow-md border-2 border-vermilion flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🎯
            </div>
          </div>
        </div>
      );

    case 'sound-memory':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-teal-100 via-emerald-50 to-teal-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-md border-2 border-teal-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🎵
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-teal-500 rounded-full animate-pulse" />
              <span className="w-1 h-5 bg-teal-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-4 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              <span className="w-1 h-6 bg-teal-700 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
            </div>
          </div>
        </div>
      );

    case 'story-memory':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-rose-100 via-pink-50 to-amber-100 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-14 bg-white rounded-xl shadow-md border-2 border-rose-300 flex items-center justify-center text-3xl transform -rotate-3 group-hover:rotate-0 transition-transform">
              📖
            </div>
            <span className="text-xs font-mono font-semibold text-rose-700 mt-1">Tales & Memory</span>
          </div>
        </div>
      );

    case 'object-recognition':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-12 h-14 bg-white rounded-xl shadow-sm border border-pink-300 flex flex-col items-center justify-center p-1">
              <span className="text-lg">🍎</span>
              <span className="text-[9px] font-mono font-bold text-stone-600 mt-0.5">Apple</span>
            </div>
            <div className="w-12 h-14 bg-white rounded-xl shadow-sm border border-pink-300 flex flex-col items-center justify-center p-1">
              <span className="text-lg">🌿</span>
              <span className="text-[9px] font-mono font-bold text-stone-600 mt-0.5">Leaf</span>
            </div>
          </div>
        </div>
      );

    case 'chess':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-stone-200 via-stone-100 to-amber-100 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-md border-2 border-stone-400 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              ♞
            </div>
            <span className="text-xs font-mono font-bold text-stone-700 mt-1">Chess Tactics</span>
          </div>
        </div>
      );

    case 'match3':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="grid grid-cols-3 gap-1.5 p-2 bg-white/90 rounded-2xl shadow-md border border-fuchsia-300 relative z-10">
            <span className="text-lg">💎</span>
            <span className="text-lg animate-bounce">⭐</span>
            <span className="text-lg">💎</span>
            <span className="text-lg">🟢</span>
            <span className="text-lg">💎</span>
            <span className="text-lg">🟢</span>
          </div>
        </div>
      );

    case 'memory-game':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-emerald-100 via-green-50 to-emerald-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="flex items-center gap-1.5 relative z-10">
            <div className="w-11 h-16 bg-white rounded-lg shadow-sm border-2 border-emerald-400 flex items-center justify-center text-lg text-red-600 transform -rotate-6">
              🂱
            </div>
            <div className="w-11 h-16 bg-white rounded-lg shadow-sm border-2 border-emerald-400 flex items-center justify-center text-lg text-stone-900 transform rotate-6">
              🂪
            </div>
          </div>
        </div>
      );

    case 'sudoku':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="grid grid-cols-3 gap-0.5 p-2 bg-white rounded-xl shadow-md border-2 border-amber-400 relative z-10">
            {['5', '3', '', '', '7', '', '', '', '9'].map((cell, idx) => (
              <div key={idx} className="w-5 h-5 border border-stone-200 flex items-center justify-center font-mono font-bold text-xs text-amber-900">
                {cell}
              </div>
            ))}
          </div>
        </div>
      );

    case 'jigsaw':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-sky-100 via-teal-50 to-blue-200 flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-md border-2 border-sky-400 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              🧩
            </div>
            <span className="text-xs font-mono font-semibold text-sky-800 mt-1">Jigsaw Puzzles</span>
          </div>
        </div>
      );

    default:
      return (
        <div className={`w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center ${className}`}>
          <span className="text-3xl">🎮</span>
        </div>
      );
  }
};
