import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, HelpCircle } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { FIND_DIFFERENCE_SCENES, DifferenceScene } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface FindDifferenceProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

export const FindDifference: React.FC<FindDifferenceProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  const diffKey = difficulty === 'adaptive' ? 'medium' : difficulty;
  const scenes = FIND_DIFFERENCE_SCENES[diffKey] || FIND_DIFFERENCE_SCENES.easy;
  const activeScene: DifferenceScene = scenes[0];

  const targetDifferencesCount = activeScene.differences.length;
  const instructions = 'Compare the two pictures side-by-side. Tap any difference you find!';

  const sessionEngine = useGameSession({
    gameId: 'find-difference',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'attention',
    instructions,
    totalQuestions: targetDifferencesCount,
    onComplete,
    onExit,
  });

  // Track found differences by coordinate string `row-col`
  const [foundKeys, setFoundKeys] = useState<string[]>([]);
  const [activeHintText, setActiveHintText] = useState<string | null>(null);

  const isDifferenceCell = useCallback(
    (r: number, c: number) => {
      return activeScene.differences.some((d) => d.row === r && d.col === c);
    },
    [activeScene.differences]
  );

  const handleCellClick = (r: number, c: number) => {
    const key = `${r}-${c}`;
    if (foundKeys.includes(key)) return;

    if (isDifferenceCell(r, c)) {
      const nextFound = [...foundKeys, key];
      setFoundKeys(nextFound);
      setActiveHintText(null);
      sessionEngine.recordAnswer({ correct: true });

      if (nextFound.length >= targetDifferencesCount) {
        setTimeout(() => {
          sessionEngine.completeGame();
        }, 800);
      }
    } else {
      sessionEngine.recordAnswer({ correct: false });
    }
  };

  const handleHint = () => {
    const unfound = activeScene.differences.filter(
      (d) => !foundKeys.includes(`${d.row}-${d.col}`)
    );
    if (unfound.length === 0) return;

    sessionEngine.useHint();
    const hintDiff = unfound[0];
    setActiveHintText(hintDiff.hint);
  };

  const handleRestart = () => {
    setFoundKeys([]);
    setActiveHintText(null);
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

  const progressPercent = Math.round((foundKeys.length / targetDifferencesCount) * 100);

  return (
    <GameLayout
      title="Find the Difference"
      gameId="find-difference"
      difficulty={difficulty}
      cognitiveDomain="attention"
      instructions={instructions}
      score={sessionEngine.metrics.score}
      progressPercent={progressPercent}
      isVoiceSpeaking={sessionEngine.isVoiceSpeaking}
      onVoiceClick={sessionEngine.speakInstructions}
      onPauseClick={sessionEngine.pauseGame}
      onExitClick={sessionEngine.exitGame}
      onHintClick={handleHint}
      hintDisabled={foundKeys.length >= targetDifferencesCount}
      gameState={sessionEngine.gameState}
      onResume={sessionEngine.resumeGame}
      onRestart={handleRestart}
    >
      <div className="bg-kraft2 border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-6 w-full max-w-4xl flex flex-col items-center">
        {/* Title and Progress */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink">
            {activeScene.title}
          </h2>
          <p className="text-sm font-mono uppercase tracking-widest text-ink mt-0.5">
            Differences Found:{' '}
            <span className="font-bold text-vermilion">
              {foundKeys.length} of {targetDifferencesCount}
            </span>
          </p>
        </div>

        {/* Hint Notification Bar */}
        {activeHintText && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-ochre border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] text-ink font-mono uppercase tracking-widest text-sm flex items-center gap-2 max-w-lg"
          >
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Hint:</strong> {activeHintText}
            </span>
          </motion.div>
        )}

        {/* Side-by-Side Scene Comparison */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
          {/* Picture A (Left) */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono uppercase tracking-widest text-ink mb-2">
              Picture A
            </span>
            <div
              className="grid gap-2 sm:gap-3 p-4 bg-kraft border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)]"
              style={{
                gridTemplateColumns: `repeat(${activeScene.gridCols}, minmax(0, 1fr))`,
              }}
            >
              {activeScene.sceneLeft.map((row, rIdx) =>
                row.map((emoji, cIdx) => {
                  const isFound = foundKeys.includes(`${rIdx}-${cIdx}`);
                  return (
                    <button
                      key={`left-${rIdx}-${cIdx}`}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 border-[3px] border-ink flex items-center justify-center text-3xl sm:text-4xl transition-all relative shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] ${
                        isFound
                          ? 'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]'
                          : 'bg-kraft border-ink hover:bg-ochre'
                      }`}
                    >
                      {emoji.startsWith('/') || emoji.startsWith('http') ? (
                        <img src={emoji} className="w-10 h-10 object-cover" />
                      ) : (
                        emoji
                      )}
                      {isFound && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Picture B (Right) */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono uppercase tracking-widest text-ink mb-2">
              Picture B
            </span>
            <div
              className="grid gap-2 sm:gap-3 p-4 bg-kraft border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)]"
              style={{
                gridTemplateColumns: `repeat(${activeScene.gridCols}, minmax(0, 1fr))`,
              }}
            >
              {activeScene.sceneRight.map((row, rIdx) =>
                row.map((emoji, cIdx) => {
                  const isFound = foundKeys.includes(`${rIdx}-${cIdx}`);
                  return (
                    <button
                      key={`right-${rIdx}-${cIdx}`}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 border-[3px] border-ink flex items-center justify-center text-3xl sm:text-4xl transition-all relative shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] ${
                        isFound
                          ? 'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]'
                          : 'bg-kraft border-ink hover:bg-ochre'
                      }`}
                    >
                      {emoji.startsWith('/') || emoji.startsWith('http') ? (
                        <img src={emoji} className="w-10 h-10 object-cover" />
                      ) : (
                        emoji
                      )}
                      {isFound && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};
