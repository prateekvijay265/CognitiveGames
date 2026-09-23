import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUpDown, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { SORT_MY_DAY_SETS, DailyActivityItem } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface SortMyDayProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export const SortMyDay: React.FC<SortMyDayProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  const { t } = useTranslation();
  const activityCounts: Record<GameDifficulty, number> = {
    easy: 4,
    medium: 6,
    hard: 8,
    adaptive: 6,
  };

  const currentCount = activityCounts[difficulty] || 4;
  const rawActivities = SORT_MY_DAY_SETS[0].activities.slice(0, currentCount);

  const instructions = 'Tap two activities to swap their positions until they flow from morning to night.';

  const sessionEngine = useGameSession({
    gameId: 'sort-my-day',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'routine-recall',
    instructions,
    totalQuestions: currentCount,
    onComplete,
    onExit,
  });

  const [items, setItems] = useState<DailyActivityItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Initialize and scramble
  const setupActivities = useCallback(() => {
    // Scramble ensuring it is not already in order
    let scrambled = [...rawActivities].sort(() => Math.random() - 0.5);
    while (scrambled.every((item, idx) => item.order === rawActivities[idx].order)) {
      scrambled = [...rawActivities].sort(() => Math.random() - 0.5);
    }
    setItems(scrambled);
    setSelectedIdx(null);
    setIsCompleted(false);
  }, [currentCount]);

  useEffect(() => {
    setupActivities();
  }, [setupActivities]);

  // Tap an activity to select or swap
  const handleItemClick = (index: number) => {
    if (isCompleted) return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else if (selectedIdx === index) {
      setSelectedIdx(null); // deselect
    } else {
      // SWAP selectedIdx and index!
      const nextItems = [...items];
      const temp = nextItems[selectedIdx];
      nextItems[selectedIdx] = nextItems[index];
      nextItems[index] = temp;
      setItems(nextItems);
      setSelectedIdx(null);

      // Check if now in order
      const correctlyPlaced = nextItems.filter((item, idx) => item.order === idx + 1).length;
      if (correctlyPlaced === currentCount) {
        setIsCompleted(true);
        sessionEngine.recordAnswer({ correct: true });
        setTimeout(() => {
          sessionEngine.completeGame({ correctAnswers: currentCount });
        }, 1200);
      }
    }
  };

  // Hint button: swaps one misplaced item into its correct position
  const handleHint = () => {
    if (isCompleted) return;
    sessionEngine.useHint();

    const misplacedIdx = items.findIndex((item, idx) => item.order !== idx + 1);
    if (misplacedIdx !== -1) {
      const correctItemOrder = misplacedIdx + 1;
      const targetIdx = items.findIndex((item) => item.order === correctItemOrder);
      if (targetIdx !== -1) {
        const nextItems = [...items];
        const temp = nextItems[misplacedIdx];
        nextItems[misplacedIdx] = nextItems[targetIdx];
        nextItems[targetIdx] = temp;
        setItems(nextItems);
      }
    }
  };

  const handleRestart = () => {
    setupActivities();
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

  const correctCount = items.filter((item, idx) => item.order === idx + 1).length;
  const progressPercent = Math.round((correctCount / currentCount) * 100);

  return (
    <GameLayout
      title="Sort My Day"
      gameId="sort-my-day"
      difficulty={difficulty}
      cognitiveDomain="routine-recall"
      instructions={instructions}
      score={sessionEngine.metrics.score}
      progressPercent={progressPercent}
      isVoiceSpeaking={sessionEngine.isVoiceSpeaking}
      onVoiceClick={sessionEngine.speakInstructions}
      onPauseClick={sessionEngine.pauseGame}
      onExitClick={sessionEngine.exitGame}
      onHintClick={handleHint}
      hintDisabled={isCompleted}
      gameState={sessionEngine.gameState}
      onResume={sessionEngine.resumeGame}
      onRestart={handleRestart}
    >
      <div className="w-full max-w-xl flex flex-col items-center bg-kraft2 border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-6">
        {/* Helper title */}
        <div className="text-center mb-4">
          <p className="font-mono uppercase tracking-widest text-ink text-sm">
            Tap an activity, then tap another to swap them into chronological order.
          </p>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-vermilion mt-2 inline-block">
            {correctCount} of {currentCount} correctly arranged
          </span>
        </div>

        {/* Activity list */}
        <div className="w-full flex flex-col gap-3 mb-6">
          {items.map((act, index) => {
            const isSelected = selectedIdx === index;
            const isCorrectPosition = act.order === index + 1;

            return (
              <motion.button
                key={act.id}
                onClick={() => handleItemClick(index)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full p-3.5 sm:p-4 border-[3px] border-ink flex items-center justify-between text-left transition-all font-mono uppercase tracking-widest ${
                  isSelected
                    ? 'bg-ochre shadow-[4px_4px_0_var(--color-ink)] translate-x-1 -translate-y-1'
                    : isCorrectPosition
                    ? 'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]'
                    : 'bg-kraft text-ink shadow-[2px_2px_0_var(--color-ink)] hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-ink)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 flex items-center justify-center text-xs font-bold border-[2px] border-ink ${isCorrectPosition ? 'bg-kraft text-ink' : 'bg-ink text-kraft'}`}>
                    {index + 1}
                  </span>
                  <img src={act.image} className="w-12 h-12 object-cover border-2 border-ink mb-2" />
                  <div>
                    <h4 className={`text-sm sm:text-base font-bold ${isCorrectPosition ? 'text-kraft' : 'text-ink'}`}>
                      {act.title}
                    </h4>
                    <span className={`text-xs ${isCorrectPosition ? 'text-kraft' : 'text-ink'} opacity-80`}>
                      {act.timeLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCorrectPosition ? (
                    <span className="font-bold text-xs flex items-center gap-1 text-kraft">
                      <CheckCircle2 className="w-4 h-4" /> Aligned
                    </span>
                  ) : (
                    <ArrowUpDown className="w-4 h-4 text-ink" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Check / Finish action */}
        {isCompleted && (
          <div className="text-center p-4 bg-felt border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] w-full font-mono uppercase tracking-widest text-kraft">
            <h4 className="font-bold text-lg">
              Wonderful! Your day is beautifully ordered.
            </h4>
          </div>
        )}
      </div>
    </GameLayout>
  );
};
