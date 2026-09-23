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
      <div className="w-full max-w-2xl flex flex-col items-center bg-kraft2 border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-6">
        {/* Round Header */}
        <div className="flex items-center justify-between w-full mb-4 font-mono uppercase tracking-widest text-ink">
          <span className="font-bold">
            Round {currentRound} of {totalRounds}
          </span>
          {phase === 'MEMORIZING' && (
            <span className="font-bold text-vermilion flex items-center gap-1">
              <Eye className="w-4 h-4" /> Remember these ({countdown}s left)
            </span>
          )}
          {phase === 'SELECTING' && (
            <span className="font-bold">
              Selected: {selectedIds.length} of {targetObjects.length}
            </span>
          )}
        </div>

        {/* Phase 1: Memorizing Phase */}
        {phase === 'MEMORIZING' && (
          <div className="w-full flex flex-col items-center">
            {/* Visual countdown bar */}
            <div className="w-full bg-kraft border-[3px] border-ink h-4 mb-6 relative">
              <div
                className="bg-vermilion h-full border-r-[3px] border-ink transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / config.viewDurationSec) * 100}%` }}
              />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink">
                Memorize These Items
              </h3>
              <p className="font-mono uppercase tracking-widest text-ink mt-1 text-sm">
                Take a good look and remember their names!
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 py-4">
              {targetObjects.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 sm:w-28 h-28 sm:h-32 bg-kraft border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] flex flex-col items-center justify-center p-2 text-center"
                >
                  <img src={item.image} className="w-12 h-12 object-cover border-2 border-ink mb-2" />
                  <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-ink line-clamp-1">
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
              className="mt-6 px-6 py-3 border-[3px] border-ink bg-vermilion text-kraft shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] transition-all font-mono font-bold uppercase tracking-widest"
            >
              I am Ready Now!
            </button>
          </div>
        )}

        {/* Phase 2: Selecting Phase */}
        {phase === 'SELECTING' && (
          <div className="w-full flex flex-col items-center">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink">
                Which items did you see?
              </h3>
              <p className="font-mono uppercase tracking-widest text-ink mt-1 text-sm">
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
                    className={`p-4 border-[3px] border-ink flex flex-col items-center justify-center transition-all relative font-mono font-bold uppercase tracking-widest ${
                      isSelected
                        ? 'bg-ochre text-ink shadow-[4px_4px_0_var(--color-ink)] translate-x-0.5 -translate-y-0.5'
                        : 'bg-kraft text-ink hover:bg-ochre hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0_var(--color-ink)]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-ink text-kraft rounded-none flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                    <img src={item.image} className="w-12 h-12 object-cover border-2 border-ink mb-2" />
                    <span className="text-xs sm:text-sm text-center">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className={`w-full max-w-xs py-4 border-[3px] border-ink font-mono font-bold uppercase tracking-widest transition-all ${
                selectedIds.length === 0
                  ? 'bg-kraft text-ink opacity-50 cursor-not-allowed'
                  : 'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)]'
              }`}
            >
              Confirm Choices
            </button>
          </div>
        )}

        {/* Phase 3: Round Feedback Phase */}
        {phase === 'FEEDBACK' && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-felt border-[3px] border-ink flex items-center justify-center text-kraft mb-3 shadow-[4px_4px_0_var(--color-ink)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-display font-bold uppercase tracking-widest text-ink mb-1">
              Good Recall!
            </h3>
            <p className="font-mono uppercase tracking-widest text-ink text-sm mb-6">
              Here are the original items from this round:
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
              {targetObjects.map((item) => {
                const wasFound = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3 border-[3px] border-ink flex flex-col items-center w-24 sm:w-28 font-mono font-bold uppercase tracking-widest ${
                      wasFound
                        ? 'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]'
                        : 'bg-kraft text-ink'
                    }`}
                  >
                    <img src={item.image} className="w-12 h-12 object-cover border-2 border-ink mb-2" />
                    
                    <span className="text-[10px] mt-1">
                      {wasFound ? '✓ Remembered' : '○ Missed'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNextRound}
              className="px-8 py-4 border-[3px] border-ink bg-vermilion text-kraft shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] transition-all font-mono font-bold uppercase tracking-widest flex items-center gap-2"
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
