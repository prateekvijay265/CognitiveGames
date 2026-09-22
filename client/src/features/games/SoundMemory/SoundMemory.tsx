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
      <div className="w-full max-w-xl flex flex-col items-center bg-kraft2 border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-6">
        {/* Round Counter */}
        <div className="text-center mb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink">
            Sound {currentIndex + 1} of {totalQuestions}
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink mt-0.5">
            Which picture matches this sound?
          </h2>
        </div>

        {/* Sound Card with Tone Player */}
        <div className="w-full bg-kraft border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] p-6 flex flex-col items-center text-center mb-6">
          <button
            onClick={playSoundTone}
            className={`w-20 h-20 rounded-none border-[3px] border-ink flex items-center justify-center transition-all shadow-[4px_4px_0_var(--color-ink)] mb-3 ${
              isPlayingAudio
                ? 'bg-ochre text-ink translate-x-1 -translate-y-1'
                : 'bg-kraft text-ink hover:bg-ochre'
            }`}
            title="Play sound again"
          >
            <Volume2 className="w-10 h-10" />
          </button>

          <span className="text-xs font-mono font-bold text-ink uppercase tracking-widest mb-1">
            Sound Prompt
          </span>
          <h3 className="text-xl font-display font-bold uppercase tracking-widest text-ink">
            {currentQ.soundLabel}
          </h3>
          <p className="text-sm font-mono uppercase tracking-widest text-ink mt-1 max-w-sm">
            {currentQ.soundDescription}
          </p>
        </div>

        {/* Hint banner */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-ochre border-[3px] border-ink font-mono font-bold uppercase tracking-widest text-ink text-sm flex items-center gap-2 max-w-md text-center shadow-[4px_4px_0_var(--color-ink)]"
          >
            <Sparkles className="w-4 h-4 text-ink shrink-0" />
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
              'bg-kraft text-ink hover:bg-ochre hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)]';

            if (showFeedback) {
              if (isCorrect) {
                cardStyle =
                  'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)] translate-x-1 -translate-y-1';
              } else if (isChosen && !isCorrect) {
                cardStyle = 'bg-vermilion text-kraft opacity-80';
              } else {
                cardStyle = 'bg-kraft text-ink opacity-50';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id, option.isCorrect)}
                disabled={showFeedback}
                className={`p-4 border-[3px] border-ink flex flex-col items-center justify-center transition-all shadow-[4px_4px_0_var(--color-ink)] font-mono uppercase tracking-widest ${cardStyle}`}
              >
                <img src={option.image} className="w-12 h-12 object-cover border-2 border-ink mb-2" />
                <span className="text-sm font-bold text-center">
                  {option.label}
                </span>
                {showFeedback && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-kraft mt-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
};
