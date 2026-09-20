import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, CheckCircle2 } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { ATTENTION_TAP_ROUNDS, AttentionTapRound } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface AttentionTapProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export const AttentionTap: React.FC<AttentionTapProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  const diffKey = difficulty === 'adaptive' ? 'medium' : difficulty;
  const availableRounds = ATTENTION_TAP_ROUNDS[diffKey] || ATTENTION_TAP_ROUNDS.easy;
  const activeRound: AttentionTapRound = availableRounds[0];

  const totalTargets = activeRound.gridItems.filter((i) => i.isTarget).length;
  const initialTimeSec = 30;

  const instructions = activeRound.instruction;

  const sessionEngine = useGameSession({
    gameId: 'attention-tap',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'attention',
    instructions,
    totalQuestions: totalTargets,
    onComplete,
    onExit,
  });

  const [tappedIds, setTappedIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(initialTimeSec);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Soft 30-second timer
  useEffect(() => {
    if (!isFinished && sessionEngine.gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFinished, sessionEngine.gameState]);

  const handleFinish = useCallback(() => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    const targetIds = new Set(activeRound.gridItems.filter((i) => i.isTarget).map((i) => i.id));
    let correctCount = 0;
    let mistakeCount = 0;

    tappedIds.forEach((id) => {
      if (targetIds.has(id)) {
        correctCount++;
      } else {
        mistakeCount++;
      }
    });

    const netScore = Math.max(0, Math.round(((correctCount - mistakeCount * 0.5) / totalTargets) * 100));

    sessionEngine.completeGame({
      correctAnswers: correctCount,
      mistakes: mistakeCount,
      score: netScore,
      accuracy: Math.round((correctCount / Math.max(1, tappedIds.length)) * 100),
    });
  }, [tappedIds, activeRound.gridItems, totalTargets, sessionEngine]);

  const handleItemTap = (item: { id: string; isTarget: boolean }) => {
    if (isFinished) return;
    if (tappedIds.includes(item.id)) return; // already tapped

    const nextTapped = [...tappedIds, item.id];
    setTappedIds(nextTapped);

    sessionEngine.recordAnswer({ correct: item.isTarget });

    // Check if all targets found
    const targetIds = activeRound.gridItems.filter((i) => i.isTarget).map((i) => i.id);
    const foundTargets = nextTapped.filter((id) => targetIds.includes(id)).length;

    if (foundTargets >= totalTargets) {
      setTimeout(() => {
        handleFinish();
      }, 500);
    }
  };

  const handleHint = () => {
    if (isFinished) return;
    const unfoundTarget = activeRound.gridItems.find(
      (item) => item.isTarget && !tappedIds.includes(item.id)
    );
    if (unfoundTarget) {
      sessionEngine.useHint();
      handleItemTap(unfoundTarget);
    }
  };

  const handleRestart = () => {
    setTappedIds([]);
    setTimeLeft(initialTimeSec);
    setIsFinished(false);
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

  const targetIds = activeRound.gridItems.filter((i) => i.isTarget).map((i) => i.id);
  const foundTargetsCount = tappedIds.filter((id) => targetIds.includes(id)).length;
  const progressPercent = Math.round((foundTargetsCount / totalTargets) * 100);

  return (
    <GameLayout
      title="Attention Tap"
      gameId="attention-tap"
      difficulty={difficulty}
      cognitiveDomain="attention"
      instructions={instructions}
      score={sessionEngine.metrics.score}
      progressPercent={progressPercent}
      isVoiceSpeaking={sessionEngine.isVoiceSpeaking}
      onVoiceClick={sessionEngine.speakInstructions}
      onPauseClick={sessionEngine.pauseGame}
      onExitClick={sessionEngine.exitGame}
      onHintClick={handleHint}
      hintDisabled={foundTargetsCount >= totalTargets || isFinished}
      gameState={sessionEngine.gameState}
      onResume={sessionEngine.resumeGame}
      onRestart={handleRestart}
    >
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Instruction Badge & Countdown */}
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-amber-950 dark:text-amber-100">
              Found: {foundTargetsCount} of {totalTargets}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-stone-800 px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Soft countdown progress line */}
        <div className="w-full bg-amber-100 dark:bg-stone-800 rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / initialTimeSec) * 100}%` }}
          />
        </div>

        {/* Object Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full mb-6">
          {activeRound.gridItems.map((item) => {
            const isTapped = tappedIds.includes(item.id);
            const isCorrectTarget = item.isTarget;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleItemTap(item)}
                whileTap={{ scale: 0.94 }}
                disabled={isTapped || isFinished}
                className={`aspect-square p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all relative shadow-xs ${
                  isTapped
                    ? isCorrectTarget
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 shadow-md ring-2 ring-emerald-300'
                      : 'bg-stone-200 dark:bg-stone-800 border-stone-300 opacity-60'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                {isTapped && isCorrectTarget && (
                  <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
                <span className="text-4xl sm:text-5xl mb-1">{item.emoji}</span>
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 text-center line-clamp-1">
                  {item.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Done Button */}
        <button
          onClick={handleFinish}
          disabled={isFinished || tappedIds.length === 0}
          className={`w-full max-w-xs py-3.5 rounded-2xl font-bold text-base shadow-md transition-all ${
            tappedIds.length === 0
              ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-[0.98]'
          }`}
        >
          I Found Them All!
        </button>
      </div>
    </GameLayout>
  );
};
