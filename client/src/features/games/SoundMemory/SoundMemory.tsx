import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { SOUND_QUESTIONS, SoundQuestion } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface SoundMemoryProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export const SoundMemory: React.FC<SoundMemoryProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  const totalQuestions = SOUND_QUESTIONS.length;
  const instructions = 'Listen to the sound and read its description, then choose the picture that matches.';

  const sessionEngine = useGameSession({
    gameId: 'sound-memory',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'recognition',
    instructions,
    totalQuestions,
    onComplete,
    onExit,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQ: SoundQuestion = SOUND_QUESTIONS[currentIndex] || SOUND_QUESTIONS[0];

  // Web Audio tone synthesizer
  const playSoundTone = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = currentQ.toneType || 'sine';
      osc.frequency.setValueAtTime(currentQ.toneFrequency || 440, ctx.currentTime);

      // Simple pitch modulation for natural sound feel
      if (currentQ.id === 'snd-3') {
        // Bird chirp frequency modulation
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.3);
      } else if (currentQ.id === 'snd-2') {
        // Bell decay
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      } else {
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      setIsPlayingAudio(true);
      osc.start();
      osc.stop(ctx.currentTime + (currentQ.id === 'snd-2' ? 1.2 : 0.8));

      setTimeout(() => {
        setIsPlayingAudio(false);
      }, (currentQ.id === 'snd-2' ? 1.2 : 0.8) * 1000);
    } catch {
      setIsPlayingAudio(false);
    }
  }, [currentQ]);

  // Automatically play sound tone when question loads
  useEffect(() => {
    playSoundTone();
  }, [currentIndex, playSoundTone]);

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (showFeedback) return;

    setSelectedId(optionId);
    setShowFeedback(true);

    sessionEngine.recordAnswer({ correct: isCorrect });

    setTimeout(() => {
      if (currentIndex + 1 < totalQuestions) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedId(null);
        setShowFeedback(false);
        setShowHint(false);
      } else {
        sessionEngine.completeGame();
      }
    }, 1400);
  };

  const handleHint = () => {
    sessionEngine.useHint();
    setShowHint(true);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedId(null);
    setShowFeedback(false);
    setShowHint(false);
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
      title="Sound Memory"
      gameId="sound-memory"
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
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Round Counter */}
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Sound {currentIndex + 1} of {totalQuestions}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-950 dark:text-amber-100 mt-0.5">
            Which picture matches this sound?
          </h2>
        </div>

        {/* Sound Card with Tone Player */}
        <div className="w-full bg-white dark:bg-stone-800 rounded-3xl p-6 border-2 border-amber-200 dark:border-stone-700 shadow-md flex flex-col items-center text-center mb-6">
          <button
            onClick={playSoundTone}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md mb-3 ${
              isPlayingAudio
                ? 'bg-amber-500 text-white scale-110 shadow-amber-300 ring-4 ring-amber-300'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
            title="Play sound again"
          >
            <Volume2 className="w-10 h-10" />
          </button>

          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            Sound Prompt
          </span>
          <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
            {currentQ.soundLabel}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-sm">
            {currentQ.soundDescription}
          </p>
        </div>

        {/* Hint banner */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300 rounded-xl text-stone-800 dark:text-stone-200 text-sm flex items-center gap-2 max-w-md text-center"
          >
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Hint:</strong> {currentQ.hint}
            </span>
          </motion.div>
        )}

        {/* 3 Choice Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
          {currentQ.options.map((option) => {
            const isChosen = selectedId === option.id;
            const isCorrect = option.isCorrect;

            let cardStyle =
              'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:scale-105 active:scale-95';

            if (showFeedback) {
              if (isCorrect) {
                cardStyle =
                  'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 shadow-md ring-2 ring-emerald-400';
              } else if (isChosen && !isCorrect) {
                cardStyle = 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 opacity-60';
              } else {
                cardStyle = 'opacity-40 border-stone-200 bg-stone-50';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id, option.isCorrect)}
                disabled={showFeedback}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all shadow-xs ${cardStyle}`}
              >
                <span className="text-4xl sm:text-5xl mb-2">{option.emoji}</span>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100 text-center">
                  {option.label}
                </span>
                {showFeedback && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
};
