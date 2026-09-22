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
      <div className="w-full max-w-2xl flex flex-col items-center bg-kraft2 border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-6">
        {/* Phase 1: Reading the Story */}
        {phase === 'READING' && (
          <div className="w-full flex flex-col items-center">
            {/* Story Card */}
            <div className="w-full bg-kraft border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] p-6 sm:p-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-ink">
                  <BookOpen className="w-6 h-6" />
                  <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink">
                    {activeStory.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest bg-ink px-3 py-1 text-kraft">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{secondsRemaining}s</span>
                </div>
              </div>

              <p className="text-base sm:text-lg leading-relaxed text-ink font-mono font-bold tracking-widest uppercase mb-6 border-b-[3px] border-dashed border-ink pb-6">
                {activeStory.storyText}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleReadStoryAloud}
                  className="px-4 py-2 border-[3px] border-ink bg-ochre text-ink font-mono font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-all shadow-[2px_2px_0_var(--color-ink)] hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-ink)]"
                >
                  <Volume2 className="w-4 h-4" />
                  Read Story to Me
                </button>

                <button
                  onClick={handleStartQuestions}
                  className="px-6 py-3 border-[3px] border-ink bg-vermilion text-kraft font-mono font-bold uppercase tracking-widest text-base flex items-center gap-2 shadow-[4px_4px_0_var(--color-ink)] transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)]"
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
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink mt-2">
                {currentQ.question}
              </h3>
            </div>

            {/* 4 Choice options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full mb-6">
              {currentQ.options.map((opt) => {
                const isChosen = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let btnClass =
                  'bg-kraft text-ink hover:bg-ochre hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)]';

                if (showFeedback) {
                  if (isCorrect) {
                    btnClass =
                      'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)] translate-x-1 -translate-y-1';
                  } else if (isChosen && !isCorrect) {
                    btnClass = 'bg-vermilion text-kraft opacity-80';
                  } else {
                    btnClass = 'bg-kraft text-ink opacity-50';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectAnswer(opt)}
                    disabled={showFeedback}
                    className={`p-4 border-[3px] border-ink font-mono font-bold uppercase tracking-widest text-base sm:text-lg transition-all text-center shadow-[4px_4px_0_var(--color-ink)] flex items-center justify-center gap-2 ${btnClass}`}
                  >
                    {opt}
                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-kraft shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-mono font-bold uppercase tracking-widest text-ink text-center mt-4 bg-ochre border-[3px] border-ink p-4 shadow-[4px_4px_0_var(--color-ink)]"
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
