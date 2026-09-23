import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  LogOut,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  Lightbulb,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { GameDifficulty, GameId, CognitiveDomain, SupportedLanguage, GameSession } from '../../types';
import { saveGameSession, getPatientGameSessions } from '../../lib/db';
import { calculateAdaptiveDifficulty } from '../../lib/adaptiveEngine';

export type GameState =
  | 'INTRO'
  | 'INSTRUCTIONS'
  | 'PRACTICE'
  | 'PLAYING'
  | 'PAUSED'
  | 'RESULT'
  | 'EXIT';

export interface UseGameSessionProps {
  gameId: GameId;
  patientId: string;
  difficulty: GameDifficulty;
  language?: SupportedLanguage;
  cognitiveDomain: CognitiveDomain;
  instructions: string;
  totalQuestions?: number;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export interface GameMetrics {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  mistakes: number;
  hintsUsed: number;
  responseTimes: number[];
  score: number;
  accuracy: number;
  averageResponseTimeMs: number;
}

export function useGameSession({
  gameId,
  patientId,
  difficulty,
  language = 'en',
  cognitiveDomain,
  instructions,
  totalQuestions = 1,
  onComplete,
  onExit,
}: UseGameSessionProps) {
  const { t } = useTranslation();
  const translatedInstructions = gameId ? t('game_instructions.' + gameId.replace('-', '_'), instructions) : instructions;
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [previousState, setPreviousState] = useState<GameState>('PLAYING');
  const [startedAt, setStartedAt] = useState<string>(() => new Date().toISOString());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [finalSession, setFinalSession] = useState<GameSession | null>(null);
  const [adaptiveFeedback, setAdaptiveFeedback] = useState<{
    recommendedDifficulty: GameDifficulty;
    reason: string;
  } | null>(null);

  const [metrics, setMetrics] = useState<GameMetrics>({
    totalQuestions,
    answeredQuestions: 0,
    correctAnswers: 0,
    mistakes: 0,
    hintsUsed: 0,
    responseTimes: [],
    score: 0,
    accuracy: 100,
    averageResponseTimeMs: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Timer effect
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);

  // Voice synthesis cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak instruction text
  const speakText = useCallback(
    (textToSpeak: string) => {
      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      if (isVoiceSpeaking) {
        setIsVoiceSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85; // Slightly slower for elderly dementia patients
      utterance.pitch = 1.0;

      // Select voice based on language if available
      const voices = window.speechSynthesis.getVoices();
      if (language === 'hi') {
        const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
        if (hiVoice) utterance.voice = hiVoice;
      } else {
        const enVoice = voices.find((v) => v.lang.startsWith('en-IN') || v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.onstart = () => setIsVoiceSpeaking(true);
      utterance.onend = () => setIsVoiceSpeaking(false);
      utterance.onerror = () => setIsVoiceSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isVoiceSpeaking, language]
  );

  const speakInstructions = useCallback(() => {
    speakText(translatedInstructions);
  }, [speakText, translatedInstructions]);

  // Web Audio chime for encouraging feedback
  const playChime = useCallback(
    (type: 'success' | 'encouragement' | 'hint') => {
      if (isAudioMuted) return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        if (type === 'success') {
          // Warm major chord arpeggio
          [523.25, 659.25, 783.99].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.35);
          });
        } else if (type === 'encouragement') {
          // Soft encouraging tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = 440;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } else {
          // Gentle chime for hint
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = 659.25;
          osc.type = 'triangle';
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        }
      } catch {
        // Fallback gracefully if audio context fails
      }
    },
    [isAudioMuted]
  );

  const pauseGame = useCallback(() => {
    setPreviousState(gameState);
    setGameState('PAUSED');
  }, [gameState]);

  const resumeGame = useCallback(() => {
    setGameState(previousState === 'PAUSED' ? 'PLAYING' : previousState);
  }, [previousState]);

  const exitGame = useCallback(() => {
    setGameState('EXIT');
    if (onExit) onExit();
  }, [onExit]);

  const restartGame = useCallback(() => {
    setGameState('PLAYING');
    setStartedAt(new Date().toISOString());
    setElapsedSeconds(0);
    setFinalSession(null);
    setAdaptiveFeedback(null);
    questionStartTimeRef.current = Date.now();
    setMetrics({
      totalQuestions,
      answeredQuestions: 0,
      correctAnswers: 0,
      mistakes: 0,
      hintsUsed: 0,
      responseTimes: [],
      score: 0,
      accuracy: 100,
      averageResponseTimeMs: 0,
    });
  }, [totalQuestions]);

  const useHint = useCallback(() => {
    playChime('hint');
    setMetrics((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));
  }, [playChime]);

  const recordAnswer = useCallback(
    ({ correct, responseTimeMs }: { correct: boolean; responseTimeMs?: number }) => {
      const now = Date.now();
      const calculatedRt = responseTimeMs ?? Math.max(200, now - questionStartTimeRef.current);
      questionStartTimeRef.current = now;

      if (correct) {
        playChime('success');
      } else {
        playChime('encouragement');
      }

      setMetrics((prev) => {
        const nextAnswered = prev.answeredQuestions + 1;
        const nextCorrect = prev.correctAnswers + (correct ? 1 : 0);
        const nextMistakes = prev.mistakes + (correct ? 0 : 1);
        const nextTimes = [...prev.responseTimes, calculatedRt];
        const avgRt = Math.round(nextTimes.reduce((a, b) => a + b, 0) / nextTimes.length);

        const accuracy = Math.round((nextCorrect / Math.max(1, nextAnswered)) * 100);
        // Score calculation: accurate answers adjusted for hints
        const hintDeduction = Math.min(25, prev.hintsUsed * 5);
        const score = Math.max(10, Math.min(100, Math.round(accuracy - hintDeduction)));

        return {
          ...prev,
          answeredQuestions: nextAnswered,
          correctAnswers: nextCorrect,
          mistakes: nextMistakes,
          responseTimes: nextTimes,
          score,
          accuracy,
          averageResponseTimeMs: avgRt,
        };
      });
    },
    [playChime]
  );

  const completeGame = useCallback(
    async (overrideMetrics?: Partial<GameMetrics>) => {
      const finalMetrics = { ...metrics, ...overrideMetrics };
      const completedAt = new Date().toISOString();

      const session: GameSession = {
        id: crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`,
        gameId,
        patientId,
        sessionId: `ses-${Date.now()}`,
        startedAt,
        completedAt,
        difficulty,
        accuracy: finalMetrics.accuracy,
        responseTimeMs: finalMetrics.averageResponseTimeMs,
        hintsUsed: finalMetrics.hintsUsed,
        mistakes: finalMetrics.mistakes,
        score: finalMetrics.score,
        totalQuestions: finalMetrics.totalQuestions,
        answeredQuestions: finalMetrics.answeredQuestions,
        completed: true,
        abandoned: false,
        cognitiveDomain,
        language,
        offline: !navigator.onLine,
        syncStatus: 'pending',
        metadata: {
          elapsedSeconds,
        },
      };

      setFinalSession(session);
      setGameState('RESULT');

      // Save to IndexedDB
      try {
        await saveGameSession(session);

        // Calculate adaptive difficulty
        const recent = await getPatientGameSessions(patientId, 10);
        const adaptive = calculateAdaptiveDifficulty({
          recentSessions: [session, ...recent],
          currentDifficulty: difficulty,
          gameId,
        });

        setAdaptiveFeedback({
          recommendedDifficulty: adaptive.recommendedDifficulty,
          reason: adaptive.reason,
        });
      } catch (err) {
        console.warn('Could not save session or calculate adaptive difficulty', err);
      }

      if (onComplete) {
        onComplete(session);
      }
    },
    [
      metrics,
      startedAt,
      gameId,
      patientId,
      difficulty,
      cognitiveDomain,
      language,
      elapsedSeconds,
      onComplete,
    ]
  );

  return {
    gameState,
    setGameState,
    metrics,
    elapsedSeconds,
    isVoiceSpeaking,
    isAudioMuted,
    finalSession,
    adaptiveFeedback,
    speakInstructions,
    speakText,
    playChime,
    pauseGame,
    resumeGame,
    exitGame,
    restartGame,
    useHint,
    recordAnswer,
    completeGame,
    setIsAudioMuted,
  };
}

export interface GameLayoutProps {
  title: string;
  gameId: GameId;
  difficulty: GameDifficulty;
  cognitiveDomain: CognitiveDomain;
  instructions: string;
  score?: number;
  progressPercent?: number;
  isVoiceSpeaking?: boolean;
  onVoiceClick: () => void;
  onPauseClick: () => void;
  onExitClick: () => void;
  onHintClick?: () => void;
  hintDisabled?: boolean;
  gameState: GameState;
  onResume: () => void;
  onRestart: () => void;
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  title,
  difficulty,
  instructions,
  score,
  progressPercent,
  isVoiceSpeaking,
  onVoiceClick,
  onPauseClick,
  onExitClick,
  onHintClick,
  hintDisabled,
  gameState,
  onResume,
  onRestart,
  children,
}) => {
  const { t } = useTranslation();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const difficultyColors: Record<GameDifficulty, string> = {
    easy: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200',
    hard: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200',
    adaptive: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-stone-100 dark:from-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100 flex flex-col select-none">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-amber-200/60 dark:border-stone-800 px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Title and Badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-950 dark:text-amber-100">
              {title}
            </h1>
            <span
              className={`text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                difficultyColors[difficulty] || difficultyColors.easy
              }`}
            >
              {difficulty}
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Voice instructions button */}
            <button
              onClick={onVoiceClick}
              aria-label="Listen to voice instructions"
              className={`p-2.5 sm:px-3 sm:py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-xs border ${
                isVoiceSpeaking
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200 dark:bg-stone-800 dark:text-amber-300 dark:border-stone-700'
              }`}
              title="Listen to Instructions"
            >
              <Volume2 className="w-5 h-5 text-current" />
              <span className="hidden sm:inline font-semibold">Listen</span>
            </button>

            {/* Hint Button if provided */}
            {onHintClick && (
              <button
                onClick={onHintClick}
                disabled={hintDisabled}
                aria-label="Use a hint"
                className={`p-2.5 sm:px-3 sm:py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-xs border ${
                  hintDisabled
                    ? 'opacity-40 cursor-not-allowed bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 dark:bg-stone-800 dark:text-amber-300'
                }`}
                title="Get a gentle hint"
              >
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline font-semibold">Hint</span>
              </button>
            )}

            {/* Pause Button */}
            <button
              onClick={onPauseClick}
              aria-label="Pause game"
              className="p-2.5 sm:px-3 sm:py-2 rounded-xl font-medium text-sm flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 transition-all shadow-xs"
              title="Pause Activity"
            >
              <Pause className="w-5 h-5" />
              <span className="hidden sm:inline">Pause</span>
            </button>

            {/* Exit Button */}
            <button
              onClick={() => setShowExitConfirm(true)}
              aria-label="Exit game"
              className="p-2.5 sm:px-3 sm:py-2 rounded-xl font-medium text-sm flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-200 border border-rose-200 dark:border-rose-900 transition-all shadow-xs"
              title="{t('arcade.exit', 'Exit Activity')}"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        {/* Progress & Score Bar */}
        {(progressPercent !== undefined || score !== undefined) && (
          <div className="max-w-5xl mx-auto mt-2 flex items-center gap-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            {progressPercent !== undefined && (
              <div className="flex-1 bg-amber-100 dark:bg-stone-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                />
              </div>
            )}
            {score !== undefined && (
              <span className="font-semibold text-amber-900 dark:text-amber-200 shrink-0">
                Score: {score}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Instruction reminder strip */}
      {instructions && (
        <div className="bg-amber-100/50 dark:bg-stone-900/50 border-b border-amber-200/40 dark:border-stone-800/80 px-4 py-2">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-stone-700 dark:text-stone-300 text-sm sm:text-base">
            <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <p className="line-clamp-1">{instructions}</p>
          </div>
        </div>
      )}

      {/* Main Game Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        {children}
      </main>

      {/* Pause Modal */}
      <AnimatePresence>
        {gameState === 'PAUSED' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-200 dark:border-stone-700 text-center"
            >
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700 dark:text-amber-300">
                <Pause className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-stone-900 dark:text-stone-100">
                {t('arcade.activity_paused', 'Activity Paused')}
              </h2>
              <p className="text-stone-600 dark:text-stone-300 text-base mb-6">
                Take a breath! You can resume right where you left off, or restart whenever you are ready.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onResume}
                  className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <Play className="w-6 h-6 fill-current" />
                  {t('arcade.resume', 'Resume Activity')}
                </button>
                <button
                  onClick={onRestart}
                  className="w-full py-3.5 rounded-2xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-base flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Start Over
                </button>
                <button
                  onClick={() => setShowExitConfirm(true)}
                  className="w-full py-3 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('arcade.exit', 'Exit Activity')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Dialog */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200 dark:border-stone-700 text-center"
            >
              <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-600 dark:text-rose-300">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-stone-100">
                Leave this activity?
              </h3>
              <p className="text-stone-600 dark:text-stone-300 text-sm mb-6">
                Your current session progress will not be marked as complete, but you can return anytime.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold"
                >
                  Keep Playing
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    onExitClick();
                  }}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
                >
                  Yes, Exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface GameResultProps {
  session: GameSession;
  adaptiveFeedback?: { recommendedDifficulty: GameDifficulty; reason: string } | null;
  onPlayAgain: () => void;
  onExit: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  session,
  adaptiveFeedback,
  onPlayAgain,
  onExit,
}) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-sky-50 to-[#FDFBF7] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm flex flex-col items-center text-center relative z-10"
      >
        {/* Smiling Sun Illustration */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="relative w-40 h-40 mb-6"
        >
           <div className="absolute inset-0 bg-[#FFD166] rounded-full flex items-center justify-center border-4 border-white shadow-md">
             <div className="flex gap-4 mb-2">
                <div className="w-2.5 h-4 bg-amber-900 rounded-full"></div>
                <div className="w-2.5 h-4 bg-amber-900 rounded-full"></div>
             </div>
             <div className="absolute bottom-10 w-8 h-3.5 border-b-4 border-amber-900 rounded-b-full"></div>
             {/* Sparkles */}
             <div className="absolute -top-2 -right-4 text-3xl">✨</div>
             <div className="absolute top-4 -left-6 text-2xl">✨</div>
           </div>
        </motion.div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-stone-900 mb-2">
          Nice try!
        </h2>
        <p className="text-stone-500 font-medium text-[15px] mb-10">
          You completed the activity.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full px-4">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 rounded-full bg-[#4A856E] text-white font-bold text-[17px] shadow-[0_4px_16px_rgba(74,133,110,0.3)] transition-transform active:scale-[0.98]"
          >
            Replay
          </button>
          <button
            onClick={onExit}
            className="w-full py-4 rounded-full bg-stone-100 text-[#4A856E] font-bold text-[17px] transition-transform active:scale-[0.98]"
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
};
