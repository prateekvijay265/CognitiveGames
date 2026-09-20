import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Check, CheckCircle2, ArrowRight } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { REMEMBER_OBJECT_POOL, RememberObjectItem } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface RememberObjectsProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export const RememberObjects: React.FC<RememberObjectsProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  // Config per difficulty
  const config = {
    easy: { objectCount: 3, optionCount: 6, viewDurationSec: 6 },
    medium: { objectCount: 5, optionCount: 8, viewDurationSec: 5 },
    hard: { objectCount: 7, optionCount: 10, viewDurationSec: 4 },
    adaptive: { objectCount: 5, optionCount: 8, viewDurationSec: 5 },
  }[difficulty];

  const totalRounds = 3;
  const instructions = 'Look carefully at the items shown. When they hide, tap the ones you remember.';

  const sessionEngine = useGameSession({
    gameId: 'remember-objects',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'memory',
    instructions,
    totalQuestions: totalRounds,
    onComplete,
    onExit,
  });

  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<'MEMORIZING' | 'SELECTING' | 'FEEDBACK'>('MEMORIZING');
  const [targetObjects, setTargetObjects] = useState<RememberObjectItem[]>([]);
  const [selectionOptions, setSelectionOptions] = useState<RememberObjectItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(config.viewDurationSec);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Setup round
  const setupRound = useCallback(() => {
    // Shuffle object pool
    const pool = [...REMEMBER_OBJECT_POOL].sort(() => Math.random() - 0.5);
    const targets = pool.slice(0, config.objectCount);
    const distractors = pool.slice(config.objectCount, config.optionCount);
    const allOptions = [...targets, ...distractors].sort(() => Math.random() - 0.5);

    setTargetObjects(targets);
    setSelectionOptions(allOptions);
    setSelectedIds([]);
    setCountdown(config.viewDurationSec);
    setPhase('MEMORIZING');
  }, [config.objectCount, config.optionCount, config.viewDurationSec]);

  // Round countdown timer
  useEffect(() => {
    if (phase === 'MEMORIZING' && sessionEngine.gameState === 'PLAYING') {
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current!);
            setPhase('SELECTING');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [phase, sessionEngine.gameState]);

  useEffect(() => {
    setupRound();
  }, [setupRound]);

  // Toggle selection
  const toggleSelect = (id: string) => {
    if (phase !== 'SELECTING') return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit choices
  const handleConfirm = () => {
    const targetIdSet = new Set(targetObjects.map((t) => t.id));
    let correctCount = 0;
    selectedIds.forEach((id) => {
      if (targetIdSet.has(id)) correctCount++;
    });

    const isSuccess = correctCount >= Math.ceil(targetObjects.length * 0.6);
    sessionEngine.recordAnswer({ correct: isSuccess });
    setPhase('FEEDBACK');
  };

  const handleNextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound((prev) => prev + 1);
      setupRound();
    } else {
      sessionEngine.completeGame();
    }
  };

  const handleRestart = () => {
    setCurrentRound(1);
    setupRound();
    sessionEngine.restartGame();
  };

  if (sessionEngine.gameState === 'RESULT' && sessionEngine.finalSession) {
    return (
      <GameResult
        session={sessionEngine.finalSession}
        adaptiveFeedback={sessionEngine.adaptiveFeedback}
        onPlayAgain={handleRestart}
        onExit={sessionEngine.exitGame}
      />
    );
  }

  const progressPercent = Math.round(((currentRound - 1) / totalRounds) * 100);

  return (
    <GameLayout
      title="Remember Objects"
      gameId="remember-objects"
      difficulty={difficulty}
      cognitiveDomain="memory"
      instructions={instructions}
      score={sessionEngine.metrics.score}
      progressPercent={progressPercent}
      isVoiceSpeaking={sessionEngine.isVoiceSpeaking}
      onVoiceClick={sessionEngine.speakInstructions}
      onPauseClick={sessionEngine.pauseGame}
      onExitClick={sessionEngine.exitGame}
      gameState={sessionEngine.gameState}
      onResume={sessionEngine.resumeGame}
      onRestart={handleRestart}
    >
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Round Header */}
        <div className="flex items-center justify-between w-full mb-4">
          <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">
            Round {currentRound} of {totalRounds}
          </span>
          {phase === 'MEMORIZING' && (
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
              <Eye className="w-4 h-4" /> Remember these ({countdown}s left)
            </span>
          )}
          {phase === 'SELECTING' && (
            <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">
              Selected: {selectedIds.length} of {targetObjects.length}
            </span>
          )}
        </div>

        {/* Phase 1: Memorizing Phase */}
        {phase === 'MEMORIZING' && (
          <div className="w-full flex flex-col items-center">
            {/* Visual countdown bar */}
            <div className="w-full bg-amber-100 dark:bg-stone-800 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="bg-amber-600 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / config.viewDurationSec) * 100}%` }}
              />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-amber-950 dark:text-amber-100">
                Memorize These Items
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Take a good look and remember their names!
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 py-4">
              {targetObjects.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 sm:w-28 h-28 sm:h-32 rounded-2xl bg-white dark:bg-stone-800 border-2 border-amber-300 dark:border-stone-700 shadow-md flex flex-col items-center justify-center p-2 text-center"
                >
                  <span className="text-4xl sm:text-5xl mb-1">{item.emoji}</span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 line-clamp-1">
                    {item.name}
                  </span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => {
                if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                setPhase('SELECTING');
              }}
              className="mt-6 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
            >
              I am Ready Now!
            </button>
          </div>
        )}

        {/* Phase 2: Selecting Phase */}
        {phase === 'SELECTING' && (
          <div className="w-full flex flex-col items-center">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-amber-950 dark:text-amber-100">
                Which items did you see?
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Tap all the items that were shown a moment ago.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full mb-6">
              {selectionOptions.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all shadow-xs relative ${
                      isSelected
                        ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-600 shadow-amber-200'
                        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                    <span className="text-4xl mb-2">{item.emoji}</span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 text-center">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className={`w-full max-w-xs py-4 rounded-2xl font-bold text-lg shadow-md transition-all ${
                selectedIds.length === 0
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-[0.98]'
              }`}
            >
              Confirm Choices
            </button>
          </div>
        )}

        {/* Phase 3: Round Feedback Phase */}
        {phase === 'FEEDBACK' && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-3">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-amber-950 dark:text-amber-100 mb-1">
              Good Recall!
            </h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm mb-6">
              Here are the original items from this round:
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
              {targetObjects.map((item) => {
                const wasFound = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center w-24 sm:w-28 ${
                      wasFound
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-300 text-stone-600'
                    }`}
                  >
                    <span className="text-3xl mb-1">{item.emoji}</span>
                    <span className="text-xs font-semibold">{item.name}</span>
                    <span className="text-[10px] mt-1 font-bold">
                      {wasFound ? '✓ Remembered' : '○ Missed'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNextRound}
              className="px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg flex items-center gap-2 shadow-md active:scale-[0.98]"
            >
              {currentRound < totalRounds ? 'Next Round' : 'See Results'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
};
