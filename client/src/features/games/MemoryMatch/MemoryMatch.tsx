import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../../types';
import { MEMORY_CARDS, MemoryCardData } from '../../../data/gameContent';
import { useGameSession, GameLayout, GameResult } from '../GameEngine';

export interface MemoryMatchProps {
  difficulty: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

interface CardItem {
  uid: string; // unique card id in game instance
  dataId: string;
  image: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
  isHinted?: boolean;
}

export const MemoryMatch: React.FC<MemoryMatchProps> = ({
  difficulty = 'easy',
  patientId,
  language = 'en',
  onComplete,
  onExit,
}) => {
  const pairCounts: Record<GameDifficulty, number> = {
    easy: 3, // 3 pairs = 6 cards (3x2)
    medium: 6, // 6 pairs = 12 cards (4x3)
    hard: 10, // 10 pairs = 20 cards (4x5)
    adaptive: 6,
  };

  const currentPairCount = pairCounts[difficulty] || 3;
  const instructions = 'Find matching pairs of cards by tapping them two at a time.';

  const sessionEngine = useGameSession({
    gameId: 'memory-match',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'memory',
    instructions,
    totalQuestions: currentPairCount,
    onComplete,
    onExit,
  });

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [matchesFound, setMatchesFound] = useState(0);

  // Initialize and shuffle cards
  const initializeDeck = useCallback(() => {
    const shuffledSource = [...MEMORY_CARDS].sort(() => Math.random() - 0.5);
    const chosenCards = shuffledSource.slice(0, currentPairCount);

    const paired: CardItem[] = [];
    chosenCards.forEach((item, idx) => {
      paired.push({
        uid: `${item.id}-a-${idx}`,
        dataId: item.id,
        image: item.image,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
      paired.push({
        uid: `${item.id}-b-${idx}`,
        dataId: item.id,
        image: item.image,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Randomize cards positions
    setCards(paired.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setIsChecking(false);
    setMatchesFound(0);
  }, [currentPairCount]);

  useEffect(() => {
    initializeDeck();
  }, [initializeDeck]);

  // Card click handler
  const handleCardClick = (index: number) => {
    if (isChecking) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (selectedCards.length === 2) return;

    // Flip chosen card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsChecking(true);
      const [firstIdx, secondIdx] = newSelected;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.dataId === secondCard.dataId) {
        // MATCH!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setSelectedCards([]);
          setIsChecking(false);
          const nextMatches = matchesFound + 1;
          setMatchesFound(nextMatches);
          sessionEngine.recordAnswer({ correct: true });

          // Check if all matched
          if (nextMatches >= currentPairCount) {
            sessionEngine.completeGame();
          }
        }, 500);
      } else {
        // NO MATCH -> flip back after 1.2 seconds
        sessionEngine.recordAnswer({ correct: false });
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  };

  // Hint button: briefly flashes an unrevealed pair
  const handleHint = () => {
    if (isChecking) return;
    const unmatched = cards.filter((c) => !c.isMatched);
    if (unmatched.length === 0) return;

    const targetDataId = unmatched[0].dataId;
    sessionEngine.useHint();

    // Temporarily flip them
    setCards((prev) =>
      prev.map((c) => (c.dataId === targetDataId ? { ...c, isFlipped: true, isHinted: true } : c))
    );

    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) =>
          c.dataId === targetDataId && !c.isMatched
            ? { ...c, isFlipped: false, isHinted: false }
            : c
        )
      );
    }, 1200);
  };

  const handleRestart = () => {
    initializeDeck();
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

  // Grid layout class based on card count
  const gridClasses: Record<GameDifficulty, string> = {
    easy: 'grid-cols-2 sm:grid-cols-3 max-w-md',
    medium: 'grid-cols-3 sm:grid-cols-4 max-w-xl',
    hard: 'grid-cols-4 sm:grid-cols-5 max-w-3xl',
    adaptive: 'grid-cols-3 sm:grid-cols-4 max-w-xl',
  };

  const progress = Math.round((matchesFound / currentPairCount) * 100);

  return (
    <GameLayout
      title="Memory Match"
      gameId="memory-match"
      difficulty={difficulty}
      cognitiveDomain="memory"
      instructions={instructions}
      score={sessionEngine.metrics.score}
      progressPercent={progress}
      isVoiceSpeaking={sessionEngine.isVoiceSpeaking}
      onVoiceClick={sessionEngine.speakInstructions}
      onPauseClick={sessionEngine.pauseGame}
      onExitClick={sessionEngine.exitGame}
      onHintClick={handleHint}
      hintDisabled={matchesFound >= currentPairCount || isChecking}
      gameState={sessionEngine.gameState}
      onResume={sessionEngine.resumeGame}
      onRestart={handleRestart}
    >
      <div className="w-full flex flex-col items-center">
        {/* Status indicator */}
        <div className="mb-4 text-center">
          <p className="text-base sm:text-lg font-mono uppercase tracking-widest text-ink font-bold">
            Pairs Found:{' '}
            <span className="font-bold text-vermilion">
              {matchesFound} of {currentPairCount}
            </span>
          </p>
        </div>

        {/* Card Grid */}
        <div className={`grid gap-3 sm:gap-4 w-full justify-center ${gridClasses[difficulty]}`}>
          {cards.map((card, index) => {
            const isRevealed = card.isFlipped || card.isMatched;

            return (
              <motion.button
                key={card.uid}
                onClick={() => handleCardClick(index)}
                whileHover={!isRevealed ? { scale: 1.03 } : {}}
                whileTap={!isRevealed ? { scale: 0.97 } : {}}
                aria-label={isRevealed ? card.name : `Card ${index + 1}`}
                className={`aspect-square min-w-[70px] sm:min-w-[90px] border-[3px] border-ink p-2 sm:p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] ${
                  card.isMatched
                    ? 'bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]'
                    : card.isFlipped
                    ? 'bg-kraft border-ink shadow-[4px_4px_0_var(--color-ink)]'
                    : 'bg-vermilion border-ink text-kraft shadow-[4px_4px_0_var(--color-ink)] hover:bg-ochre hover:text-ink'
                }`}
              >
                {isRevealed ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <img src={card.image} className="w-12 h-12 object-cover border-2 border-ink mb-2" />
                    <span className="text-[11px] sm:text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight">
                      {card.name}
                    </span>
                    {card.isMatched && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                        <Check className="w-3 h-3" /> Matched
                      </span>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ rotate: 0 }}
                    className="flex flex-col items-center text-amber-100"
                  >
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
};
