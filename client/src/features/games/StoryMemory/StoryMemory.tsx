import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Clock, Volume2, ArrowRight } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { STORIES, StoryData } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface StoryMemoryProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export const StoryMemory: React.FC<StoryMemoryProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  const diffKey = difficulty === 'adaptive' ? 'medium' : difficulty;
  const activeStory: StoryData = STORIES[0]; // Tea Garden Story
  const readDurationSec = activeStory.readingDurationSec[diffKey] || 30;

  const totalQuestions = activeStory.questions.length;
  const instructions = 'Read or listen to the short story, then answer simple questions about it.';

  const sessionEngine = useGameSession({
    gameId: 'story-memory',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'memory',
    instructions,
    totalQuestions,
    onComplete,
    onExit,
  });

  const [phase, setPhase] = useState<'READING' | 'QUESTIONS'>('READING');
  const [secondsRemaining, setSecondsRemaining] = useState(readDurationSec);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reading countdown timer
  useEffect(() => {
    if (phase === 'READING' && sessionEngine.gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setPhase('QUESTIONS');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, sessionEngine.gameState]);

  const handleReadStoryAloud = () => {
    sessionEngine.speakText(activeStory.storyText);
  };

  const handleStartQuestions = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setPhase('QUESTIONS');
  };

  const currentQ = activeStory.questions[currentQuestionIndex];

  const handleSelectAnswer = (option: string) => {
    if (showFeedback || !currentQ) return;

    setSelectedOption(option);
    setShowFeedback(true);

    const isCorrect = option === currentQ.correctAnswer;
    sessionEngine.recordAnswer({ correct: isCorrect });

    setTimeout(() => {
      if (currentQuestionIndex + 1 < totalQuestions) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        sessionEngine.completeGame();
      }
    }, 1500);
  };

  const handleRestart = () => {
    setPhase('READING');
    setSecondsRemaining(readDurationSec);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
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

  const progressPercent =
    phase === 'READING'
      ? Math.round(((readDurationSec - secondsRemaining) / readDurationSec) * 50)
      : 50 + Math.round((currentQuestionIndex / totalQuestions) * 50);

  return (
    <GameLayout
      title="Story Memory"
      gameId="story-memory"
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
        {/* Phase 1: Reading the Story */}
        {phase === 'READING' && (
          <div className="w-full flex flex-col items-center">
            {/* Story Card */}
            <div className="w-full bg-white dark:bg-stone-800 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-stone-700 shadow-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <BookOpen className="w-6 h-6" />
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-950 dark:text-amber-100">
                    {activeStory.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold bg-amber-100 dark:bg-stone-700 px-3 py-1 rounded-full text-amber-900 dark:text-amber-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{secondsRemaining}s</span>
                </div>
              </div>

              <p className="text-base sm:text-lg leading-relaxed text-stone-800 dark:text-stone-200 font-serif mb-6">
                {activeStory.storyText}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-amber-100 dark:border-stone-700">
                <button
                  onClick={handleReadStoryAloud}
                  className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  Read Story to Me
                </button>

                <button
                  onClick={handleStartQuestions}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
                >
                  I am Ready for Questions
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Comprehension Questions */}
        {phase === 'QUESTIONS' && currentQ && (
          <div className="w-full flex flex-col items-center">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">
                {currentQ.question}
              </h3>
            </div>

            {/* 4 Choice options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full mb-6">
              {currentQ.options.map((opt) => {
                const isChosen = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let btnClass =
                  'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:border-amber-400';

                if (showFeedback) {
                  if (isCorrect) {
                    btnClass =
                      'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-md ring-2 ring-emerald-400';
                  } else if (isChosen && !isCorrect) {
                    btnClass = 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 opacity-60';
                  } else {
                    btnClass = 'opacity-40 border-stone-200 bg-stone-50';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectAnswer(opt)}
                    disabled={showFeedback}
                    className={`p-4 rounded-2xl border-2 font-bold text-base sm:text-lg transition-all text-center shadow-xs flex items-center justify-center gap-2 ${btnClass}`}
                  >
                    {opt}
                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-stone-600 dark:text-stone-300 text-center italic"
              >
                {currentQ.explanation}
              </motion.p>
            )}
          </div>
        )}
      </div>
    </GameLayout>
  );
};
