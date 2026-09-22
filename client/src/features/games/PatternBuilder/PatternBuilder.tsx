import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { PATTERN_QUESTIONS, PatternQuestion } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface PatternBuilderProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export const PatternBuilder: React.FC<PatternBuilderProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  const diffKey = difficulty === 'adaptive' ? 'medium' : difficulty;
  const rawPatterns = PATTERN_QUESTIONS[diffKey] || PATTERN_QUESTIONS.easy;
  const totalQuestions = Math.min(10, rawPatterns.length);

  const instructions = 'Look at the sequence pattern and choose which symbol comes next.';

  const sessionEngine = useGameSession({
    gameId: 'pattern-builder',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'pattern-reasoning',
    instructions,
    totalQuestions,
    onComplete,
    onExit,
  });

  const [questionList, setQuestionList] = useState<PatternQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Setup questions
  const setupQuestions = useCallback(() => {
    const list = [...rawPatterns].slice(0, totalQuestions);
    setQuestionList(list);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowExplanation(false);
  }, [rawPatterns, totalQuestions]);

  useEffect(() => {
    setupQuestions();
  }, [setupQuestions]);

  const currentPattern = questionList[currentIndex] || questionList[0];

  const handleSelectOption = (option: string) => {
    if (showFeedback || !currentPattern) return;

    setSelectedAnswer(option);
    setShowFeedback(true);
    setShowExplanation(true);

    const isCorrect = option === currentPattern.correctAnswer;
    sessionEngine.recordAnswer({ correct: isCorrect });

    setTimeout(() => {
      if (currentIndex + 1 < totalQuestions) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setShowExplanation(false);
      } else {
        sessionEngine.completeGame();
      }
    }, 1500);
  };

  const handleHint = () => {
    if (!currentPattern) return;
    sessionEngine.useHint();
    setShowExplanation(true);
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

  const progressPercent = Math.round((currentIndex / totalQuestions) * 100);

  return (
    <GameLayout
      title="Pattern Builder"
      gameId="pattern-builder"
      difficulty={difficulty}
      cognitiveDomain="pattern-reasoning"
      instructions={instructions}
      score={sessionEngine.metrics.score}
      progressPercent={progressPercent}
      isVoiceSpeaking={sessionEngine.isVoiceSpeaking}
      onVoiceClick={sessionEngine.speakInstructions}
      onPauseClick={sessionEngine.pauseGame}
      onExitClick={sessionEngine.exitGame}
      onHintClick={handleHint}
      hintDisabled={showExplanation}
      gameState={sessionEngine.gameState}
      onResume={sessionEngine.resumeGame}
      onRestart={handleRestart}
    >
      {currentPattern && (
        <div className="bg-kraft2 border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-6 w-full max-w-2xl flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-ink">
              Pattern {currentIndex + 1} of {totalQuestions}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink mt-1">
              What completes this pattern?
            </h2>
          </div>

          {/* Sequence Display Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-kraft border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] mb-8">
            {currentPattern.sequence.map((symbol, idx) => {
              const isMissingItem = symbol === '?';
              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 border-[3px] border-ink flex items-center justify-center text-3xl sm:text-4xl transition-all shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] ${
                    isMissingItem
                      ? 'bg-ochre border-ink text-ink font-extrabold shadow-[4px_4px_0_var(--color-ink)]'
                      : 'bg-kraft border-ink text-ink'
                  }`}
                >
                  {isMissingItem && showFeedback ? <img src={currentPattern.correctAnswer} className="w-10 h-10 object-cover" /> : symbol === "?" ? "?" : <img src={symbol} className="w-10 h-10 object-cover" />}
                </motion.div>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-ochre border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] text-ink font-mono uppercase tracking-widest text-sm flex items-center gap-2 max-w-md text-center"
            >
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{currentPattern.explanation}</span>
            </motion.div>
          )}

          {/* 4 Choice Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-lg">
            {currentPattern.options.map((option) => {
              const isChosen = selectedAnswer === option;
              const isCorrect = option === currentPattern.correctAnswer;

              let btnClass =
                'bg-kraft text-ink border-ink hover:bg-vermilion hover:text-kraft';

              if (showFeedback) {
                if (isCorrect) {
                  btnClass =
                    'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]';
                } else if (isChosen && !isCorrect) {
                  btnClass = 'bg-vermilion text-kraft opacity-60 border-ink';
                } else {
                  btnClass = 'opacity-40 border-ink bg-kraft text-ink';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  disabled={showFeedback}
                  className={`p-4 border-[3px] border-ink flex items-center justify-center text-4xl sm:text-5xl transition-all shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] font-mono font-bold uppercase tracking-widest ${btnClass}`}
                > {option.startswith("http") || option.startswith("/") ? <img src={option} className="w-12 h-12 object-cover" /> : option} </button>
              );
            })}
          </div>
        </div>
      )}
    </GameLayout>
  );
};
