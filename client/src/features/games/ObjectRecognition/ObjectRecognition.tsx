import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
        <div className="bg-kraft2 border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-6 w-full max-w-xl flex flex-col items-center">
          {/* Round Header */}
          <div className="text-center mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-ink">
              Question {currentIndex + 1} of {totalRounds}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink mt-0.5">
              What is this?
            </h2>
          </div>

          {/* Hint callout if requested */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-ochre border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] text-ink font-mono uppercase tracking-widest text-sm flex items-center gap-2 max-w-md"
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
            className="w-36 h-36 sm:w-44 sm:h-44 bg-kraft border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] flex items-center justify-center mb-6"
          >
            <img src={currentItem.image} className="w-12 h-12 object-cover border-2 border-ink mb-2" />
          </motion.div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
            {currentItem.options.map((option) => {
              const isChosen = selectedOption === option;
              const isCorrectAnswer = option === currentItem.correctName;

              let buttonStyle =
                'bg-kraft text-ink border-ink hover:bg-ochre';

              if (showFeedback) {
                if (isCorrectAnswer) {
                  buttonStyle =
                    'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]';
                } else if (isChosen && !isCorrectAnswer) {
                  buttonStyle =
                    'bg-vermilion text-kraft border-ink';
                } else {
                  buttonStyle = 'opacity-40 border-ink bg-kraft';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  disabled={showFeedback}
                  className={`p-4 border-[3px] border-ink font-mono font-bold uppercase tracking-widest text-base sm:text-lg transition-all text-center flex items-center justify-center gap-2 shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] ${buttonStyle}`}
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

