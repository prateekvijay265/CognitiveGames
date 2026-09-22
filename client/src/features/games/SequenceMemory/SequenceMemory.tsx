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
      <div className="w-full max-w-2xl flex flex-col items-center bg-kraft2 border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-6">
        {/* Sequence Title & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink">
            {currentSequence.title}
          </h2>
          <p className="text-sm font-mono uppercase tracking-widest text-ink mt-1">
            {currentSequence.description}
          </p>
        </div>

        {/* Phase 1: Showing Phase */}
        {phase === 'SHOWING' && (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 text-ink font-mono font-bold uppercase tracking-widest text-sm">
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
                      className={`p-3 sm:p-4 border-[3px] border-ink flex flex-col items-center w-24 sm:w-28 text-center transition-all font-mono font-bold uppercase tracking-widest ${
                        isCurrentActive
                          ? 'bg-ochre shadow-[4px_4px_0_var(--color-ink)] text-ink'
                          : isPassed
                          ? 'bg-kraft border-ink text-ink'
                          : 'bg-kraft border-ink opacity-60 text-ink'
                      }`}
                    >
                      <span className="text-[10px] sm:text-xs mb-1">
                        Step {item.step}
                      </span>
                      <span className="text-3xl sm:text-4xl mb-1">{item.emoji}</span>
                      <span className="text-[10px] sm:text-xs leading-tight line-clamp-2">
                        {item.name}
                      </span>
                    </motion.div>

                    {idx < currentSequence.items.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-ink hidden sm:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <button
              onClick={() => setPhase('RECALLING')}
              className="mt-6 px-6 py-3 border-[3px] border-ink bg-vermilion text-kraft shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] transition-all font-mono font-bold uppercase tracking-widest flex items-center gap-2"
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
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink mb-2 block text-center">
                Your Sequence (Tap an placed item to remove)
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-3 bg-kraft border-[3px] border-ink min-h-[110px]">
                {currentSequence.items.map((_, slotIdx) => {
                  const itemInSlot = selectedItems[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      onClick={() => itemInSlot && handleRemoveFromSlot(slotIdx)}
                      className={`w-20 sm:w-24 h-24 sm:h-28 border-[3px] border-ink flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all font-mono font-bold uppercase tracking-widest ${
                        itemInSlot
                          ? 'bg-ochre shadow-[4px_4px_0_var(--color-ink)] text-ink'
                          : 'border-dashed bg-kraft text-ink opacity-50'
                      }`}
                    >
                      {itemInSlot ? (
                        <>
                          <span className="text-[10px] sm:text-xs mb-0.5">
                            Step {slotIdx + 1}
                          </span>
                          <span className="text-3xl mb-1">{itemInSlot.emoji}</span>
                          <span className="text-[9px] sm:text-[10px] leading-tight line-clamp-1">
                            {itemInSlot.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm">
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
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink mb-3 block text-center">
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
                      className={`p-3 sm:p-4 border-[3px] border-ink flex flex-col items-center w-24 sm:w-28 text-center transition-all font-mono font-bold uppercase tracking-widest ${
                        isUsed
                          ? 'opacity-50 bg-kraft cursor-not-allowed text-ink'
                          : 'bg-kraft text-ink shadow-[4px_4px_0_var(--color-ink)] hover:bg-ochre hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_var(--color-ink)]'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl mb-1">{item.emoji}</span>
                      <span className="text-[10px] sm:text-xs leading-tight line-clamp-2">
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
            <div className="w-14 h-14 bg-felt border-[3px] border-ink rounded-none flex items-center justify-center text-kraft shadow-[4px_4px_0_var(--color-ink)] mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold uppercase tracking-widest text-ink mb-1">
              Sequence Completed!
            </h3>
            <p className="text-sm font-mono uppercase tracking-widest text-ink mb-6">
              Here is the natural order of steps:
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {currentSequence.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 border-[3px] border-ink bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)] flex flex-col items-center w-24 font-mono font-bold uppercase tracking-widest"
                >
                  <span className="text-[10px] sm:text-xs mb-0.5">
                    Step {idx + 1}
                  </span>
                  <span className="text-3xl mb-1">{item.emoji}</span>
                  <span className="text-[9px] sm:text-[10px] text-center line-clamp-1">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextSet}
              className="px-8 py-4 border-[3px] border-ink bg-vermilion text-kraft shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] transition-all font-mono font-bold uppercase tracking-widest flex items-center gap-2"
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
