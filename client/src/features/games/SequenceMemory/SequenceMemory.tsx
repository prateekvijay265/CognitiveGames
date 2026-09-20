import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, ArrowRight, Eye, Play } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { SEQUENCE_SETS, SequenceData } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface SequenceMemoryProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export const SequenceMemory: React.FC<SequenceMemoryProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  const diffKey = difficulty === 'adaptive' ? 'medium' : difficulty;
  const availableSets = SEQUENCE_SETS[diffKey] || SEQUENCE_SETS.easy;

  const instructions = 'Watch the sequence steps, then tap them in the correct order.';

  const sessionEngine = useGameSession({
    gameId: 'sequence-memory',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'routine-recall',
    instructions,
    totalQuestions: availableSets.length,
    onComplete,
    onExit,
  });

  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [phase, setPhase] = useState<'SHOWING' | 'RECALLING' | 'FEEDBACK'>('SHOWING');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<{ id: string; emoji: string; name: string }[]>([]);
  const [scrambledOptions, setScrambledOptions] = useState<{ id: string; emoji: string; name: string }[]>([]);

  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSequence: SequenceData = availableSets[currentSetIndex] || availableSets[0];

  // Setup current sequence
  const startSequence = useCallback(() => {
    setPhase('SHOWING');
    setActiveStepIndex(0);
    setSelectedItems([]);

    // Scramble the items for recall
    const scrambled = [...currentSequence.items].sort(() => Math.random() - 0.5);
    setScrambledOptions(scrambled);
  }, [currentSequence]);

  useEffect(() => {
    startSequence();
  }, [startSequence]);

  // Step-by-step presentation animation
  useEffect(() => {
    if (phase === 'SHOWING' && sessionEngine.gameState === 'PLAYING') {
      if (activeStepIndex < currentSequence.items.length) {
        stepTimerRef.current = setTimeout(() => {
          setActiveStepIndex((prev) => prev + 1);
        }, 1800);
      } else {
        // Finished preview, move to recall
        stepTimerRef.current = setTimeout(() => {
          setPhase('RECALLING');
        }, 1200);
      }
    }

    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [phase, activeStepIndex, currentSequence.items.length, sessionEngine.gameState]);

  // Tap an option from the scrambled bank
  const handleSelectOption = (item: { id: string; emoji: string; name: string }) => {
    if (phase !== 'RECALLING') return;
    if (selectedItems.some((s) => s.id === item.id)) return;

    const nextSelected = [...selectedItems, item];
    setSelectedItems(nextSelected);

    // If filled all slots, check sequence!
    if (nextSelected.length === currentSequence.items.length) {
      let isCorrect = true;
      for (let i = 0; i < currentSequence.items.length; i++) {
        if (nextSelected[i].id !== currentSequence.items[i].id) {
          isCorrect = false;
          break;
        }
      }

      sessionEngine.recordAnswer({ correct: isCorrect });
      setPhase('FEEDBACK');
    }
  };

  // Remove an item from sequence slot by tapping it
  const handleRemoveFromSlot = (index: number) => {
    if (phase !== 'RECALLING') return;
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Hint button: reveals the next expected item
  const handleHint = () => {
    if (phase !== 'RECALLING') return;
    const nextExpectedIndex = selectedItems.length;
    if (nextExpectedIndex < currentSequence.items.length) {
      sessionEngine.useHint();
      const expectedItem = currentSequence.items[nextExpectedIndex];
      handleSelectOption(expectedItem);
    }
  };

  const handleNextSet = () => {
    if (currentSetIndex + 1 < availableSets.length) {
      setCurrentSetIndex((prev) => prev + 1);
    } else {
      sessionEngine.completeGame();
    }
  };

  const handleRestart = () => {
    setCurrentSetIndex(0);
    startSequence();
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

  const progressPercent = Math.round((currentSetIndex / availableSets.length) * 100);

  return (
    <GameLayout
      title="Sequence Memory"
      gameId="sequence-memory"
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
      hintDisabled={phase !== 'RECALLING'}
      gameState={sessionEngine.gameState}
      onResume={sessionEngine.resumeGame}
      onRestart={handleRestart}
    >
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Sequence Title & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-950 dark:text-amber-100">
            {currentSequence.title}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
            {currentSequence.description}
          </p>
        </div>

        {/* Phase 1: Showing Phase */}
        {phase === 'SHOWING' && (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-300 text-sm font-semibold">
              <Eye className="w-4 h-4" /> Watch the steps in order:
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-6">
              {currentSequence.items.map((item, idx) => {
                const isCurrentActive = idx === activeStepIndex;
                const isPassed = idx < activeStepIndex;

                return (
                  <React.Fragment key={item.id}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.4 }}
                      animate={
                        isCurrentActive
                          ? { scale: 1.15, opacity: 1 }
                          : isPassed
                          ? { scale: 1, opacity: 0.9 }
                          : { scale: 0.9, opacity: 0.3 }
                      }
                      className={`p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center w-24 sm:w-28 text-center transition-all ${
                        isCurrentActive
                          ? 'bg-amber-100 border-amber-600 shadow-lg text-amber-950 ring-4 ring-amber-300/60'
                          : isPassed
                          ? 'bg-white dark:bg-stone-800 border-stone-300'
                          : 'bg-stone-100 dark:bg-stone-900 border-stone-200 opacity-40'
                      }`}
                    >
                      <span className="text-xs font-bold text-stone-500 mb-1">
                        Step {item.step}
                      </span>
                      <span className="text-3xl sm:text-4xl mb-1">{item.emoji}</span>
                      <span className="text-xs font-semibold leading-tight line-clamp-2">
                        {item.name}
                      </span>
                    </motion.div>

                    {idx < currentSequence.items.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-stone-400 hidden sm:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <button
              onClick={() => setPhase('RECALLING')}
              className="mt-6 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-2 shadow-xs"
            >
              <Play className="w-4 h-4 fill-current" /> Ready to Arrange
            </button>
          </div>
        )}

        {/* Phase 2: Recalling Phase */}
        {phase === 'RECALLING' && (
          <div className="w-full flex flex-col items-center">
            {/* Answer Sequence Slots */}
            <div className="w-full mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 block text-center">
                Your Sequence (Tap an placed item to remove)
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-3 bg-amber-50/60 dark:bg-stone-800/40 rounded-2xl border border-amber-200 dark:border-stone-700 min-h-[110px]">
                {currentSequence.items.map((_, slotIdx) => {
                  const itemInSlot = selectedItems[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      onClick={() => itemInSlot && handleRemoveFromSlot(slotIdx)}
                      className={`w-20 sm:w-24 h-24 sm:h-28 rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all ${
                        itemInSlot
                          ? 'bg-white dark:bg-stone-800 border-amber-500 shadow-sm hover:border-rose-400'
                          : 'border-dashed border-stone-300 dark:border-stone-700 bg-white/40 dark:bg-stone-900/40 text-stone-400'
                      }`}
                    >
                      {itemInSlot ? (
                        <>
                          <span className="text-xs font-bold text-amber-700 mb-0.5">
                            Step {slotIdx + 1}
                          </span>
                          <span className="text-3xl mb-1">{itemInSlot.emoji}</span>
                          <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                            {itemInSlot.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-stone-400">
                          {slotIdx + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Options Bank */}
            <div className="w-full">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 block text-center">
                Tap to place in sequence:
              </span>
              <div className="flex flex-wrap justify-center gap-3">
                {scrambledOptions.map((item) => {
                  const isUsed = selectedItems.some((s) => s.id === item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectOption(item)}
                      disabled={isUsed}
                      className={`p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center w-24 sm:w-28 text-center transition-all shadow-xs ${
                        isUsed
                          ? 'opacity-30 border-stone-200 dark:border-stone-800 bg-stone-100 cursor-not-allowed'
                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl mb-1">{item.emoji}</span>
                      <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight line-clamp-2">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Feedback Phase */}
        {phase === 'FEEDBACK' && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-amber-950 dark:text-amber-100 mb-1">
              Sequence Completed!
            </h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm mb-6">
              Here is the natural order of steps:
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {currentSequence.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 flex flex-col items-center w-24"
                >
                  <span className="text-xs font-bold text-emerald-700 mb-0.5">
                    Step {idx + 1}
                  </span>
                  <span className="text-3xl mb-1">{item.emoji}</span>
                  <span className="text-[11px] font-semibold text-center line-clamp-1">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextSet}
              className="px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg flex items-center gap-2 shadow-md active:scale-[0.98]"
            >
              {currentSetIndex + 1 < availableSets.length ? 'Next Sequence' : 'Finish Activity'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
};
