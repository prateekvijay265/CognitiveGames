import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { OBJECT_RECOGNITION_ITEMS, ObjectRecognitionItem } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface ObjectRecognitionProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export const ObjectRecognition: React.FC<ObjectRecognitionProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  const roundCounts: Record<GameDifficulty, number> = {
    easy: 5,
    medium: 8,
    hard: 10,
    adaptive: 8,
  };

  const totalRounds = roundCounts[difficulty] || 5;
  const instructions = 'Look at the picture and tap the button with its matching name.';

  const sessionEngine = useGameSession({
    gameId: 'object-recognition',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'recognition',
    instructions,
    totalQuestions: totalRounds,
    onComplete,
    onExit,
  });

  const [questionList, setQuestionList] = useState<ObjectRecognitionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Initialize questions
  const setupQuestions = useCallback(() => {
    const shuffled = [...OBJECT_RECOGNITION_ITEMS]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalRounds);
    setQuestionList(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowHint(false);
  }, [totalRounds]);

  useEffect(() => {
    setupQuestions();
  }, [setupQuestions]);

  const currentItem = questionList[currentIndex] || questionList[0];

  const handleSelectOption = (option: string) => {
    if (showFeedback || !currentItem) return;

    setSelectedOption(option);
    setShowFeedback(true);

    const isCorrect = option === currentItem.correctName;
    sessionEngine.recordAnswer({ correct: isCorrect });

    // Transition to next question after brief feedback
    setTimeout(() => {
      if (currentIndex + 1 < totalRounds) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setShowHint(false);
      } else {
        sessionEngine.completeGame();
      }
    }, 1400);
  };

  const handleHint = () => {
    if (!currentItem) return;
    sessionEngine.useHint();
    setShowHint(true);
  };

  const handleRestart = () => {
    setupQuestions();
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

  const progressPercent = Math.round((currentIndex / totalRounds) * 100);

  return (
    <GameLayout
      title="Object Recognition"
      gameId="object-recognition"
      difficulty={difficulty}
      cognitiveDomain="recognition"
      instructions={instructions}
      score={sessionEngine.metrics.score}
      progressPercent={progressPercent}
      isVoiceSpeaking={sessionEngine.isVoiceSpeaking}
      onVoiceClick={sessionEngine.speakInstructions}
      onPauseClick={sessionEngine.pauseGame}
      onExitClick={sessionEngine.exitGame}
      onHintClick={handleHint}
      hintDisabled={showHint}
      gameState={sessionEngine.gameState}
      onResume={sessionEngine.resumeGame}
      onRestart={handleRestart}
    >
      {currentItem && (
        <div className="w-full max-w-xl flex flex-col items-center">
          {/* Round Header */}
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Question {currentIndex + 1} of {totalRounds}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950 dark:text-amber-100 mt-0.5">
              What is this?
            </h2>
          </div>

          {/* Hint callout if requested */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 rounded-xl text-stone-800 dark:text-stone-200 text-sm flex items-center gap-2 max-w-md"
            >
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Clue:</strong> {currentItem.hint}
              </span>
            </motion.div>
          )}

          {/* Large Picture Card */}
          <motion.div
            key={currentItem.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white dark:bg-stone-800 border-2 border-amber-200 dark:border-stone-700 shadow-lg flex items-center justify-center mb-6"
          >
            <span className="text-7xl sm:text-8xl select-none">{currentItem.emoji}</span>
          </motion.div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
            {currentItem.options.map((option) => {
              const isChosen = selectedOption === option;
              const isCorrectAnswer = option === currentItem.correctName;

              let buttonStyle =
                'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:border-amber-400 hover:bg-amber-50/50';

              if (showFeedback) {
                if (isCorrectAnswer) {
                  buttonStyle =
                    'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-md ring-2 ring-emerald-400';
                } else if (isChosen && !isCorrectAnswer) {
                  buttonStyle =
                    'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200';
                } else {
                  buttonStyle = 'opacity-40 border-stone-200 bg-stone-50';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  disabled={showFeedback}
                  className={`p-4 rounded-2xl border-2 font-bold text-base sm:text-lg transition-all text-center shadow-xs flex items-center justify-center gap-2 ${buttonStyle}`}
                >
                  {option}
                  {showFeedback && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Educational cultural fact snippet on feedback */}
          {showFeedback && currentItem.culturalFact && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 text-center italic mt-2 px-4"
            >
              💡 {currentItem.culturalFact}
            </motion.p>
          )}
        </div>
      )}
    </GameLayout>
  );
};
