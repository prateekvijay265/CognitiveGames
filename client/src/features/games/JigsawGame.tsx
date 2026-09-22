import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Sparkles } from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '../../types';
import { useGameSession, GameLayout, GameResult } from './GameEngine';

export interface JigsawGameProps {
  difficulty?: GameDifficulty;
  patientId?: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
  muted?: boolean;
  onMute?: () => void;
}

const IMAGES = [
  { id: 'train', src: '/images/train.jpg', name: 'Mountain Train' },
  { id: 'garden', src: '/images/garden.jpg', name: 'Tea Garden' },
  { id: 'market', src: '/images/market.jpg', name: 'Village Market' },
  { id: 'harbor', src: '/images/harbor.jpg', name: 'River Boat' }
];

export default function JigsawGame({
  difficulty = 'easy',
  patientId = 'demo-patient',
  language = 'en',
  onComplete,
  onExit,
  muted,
  onMute,
}: JigsawGameProps) {
  const getGrid = (diff: GameDifficulty) => {
    if (diff === 'easy') return { rows: 3, cols: 3 };
    if (diff === 'medium' || diff === 'adaptive') return { rows: 4, cols: 4 };
    return { rows: 5, cols: 5 };
  };

  const { rows, cols } = getGrid(difficulty);
  const totalPieces = rows * cols;
  
  const [currentRound, setCurrentRound] = useState(0);
  const totalRounds = 3;
  
  const [image, setImage] = useState(IMAGES[0]);
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const instructions = 'Tap two pieces to swap them. Complete the picture!';

  const sessionEngine = useGameSession({
    gameId: 'jigsaw',
    patientId,
    difficulty,
    language,
    cognitiveDomain: 'recognition',
    instructions,
    totalQuestions: totalRounds,
    onComplete,
    onExit,
  });

  const initRound = useCallback(() => {
    const img = IMAGES[currentRound % IMAGES.length];
    setImage(img);
    
    const solved = Array.from({ length: totalPieces }, (_, i) => i);
    let shuffled = [...solved];
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (shuffled.every((val, index) => val === solved[index]));
    
    setPieces(shuffled);
    setSelectedPiece(null);
    setIsSolved(false);
  }, [currentRound, totalPieces]);

  useEffect(() => {
    if (sessionEngine.gameState === 'PLAYING') {
      initRound();
    }
  }, [sessionEngine.gameState, currentRound, initRound]);

  const checkSolved = (currentPieces: number[]) => {
    return currentPieces.every((p, i) => p === i);
  };

  const handlePieceClick = (index: number) => {
    if (isSolved || sessionEngine.gameState !== 'PLAYING') return;
    
    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      if (selectedPiece === index) {
        setSelectedPiece(null);
        return;
      }
      
      const newPieces = [...pieces];
      const temp = newPieces[selectedPiece];
      newPieces[selectedPiece] = newPieces[index];
      newPieces[index] = temp;
      
      setPieces(newPieces);
      setSelectedPiece(null);
      
      if (checkSolved(newPieces)) {
        setIsSolved(true);
        setTimeout(() => {
          sessionEngine.recordAnswer({ correct: true });
          if (currentRound + 1 < totalRounds) {
            setCurrentRound(r => r + 1);
          } else {
            sessionEngine.completeGame();
          }
        }, 2000);
      }
    }
  };

  const handleRestart = () => {
    setCurrentRound(0);
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

  const progressPercent = Math.round((currentRound / totalRounds) * 100);

  return (
    <GameLayout
      title="Jigsaw Puzzle"
      gameId="jigsaw"
      difficulty={difficulty}
      cognitiveDomain="recognition"
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
      <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-4 px-4 h-full relative">
        
        {sessionEngine.gameState === 'PLAYING' && (
          <div className="w-full flex flex-col items-center">
            
            <div className="flex justify-between w-full mb-4 items-center">
              <div className="text-kraft font-mono uppercase tracking-widest text-sm bg-ink/50 px-3 py-1 border border-ink/40">
                Round {currentRound + 1} of {totalRounds}
              </div>
              <div className="text-ink font-bold font-display tracking-widest uppercase text-xl text-center">
                {image.name}
              </div>
              <button 
                onClick={initRound}
                disabled={isSolved}
                className="btn btn-ghost disabled:opacity-50 !py-1 !px-3 !text-xs"
              >
                <Shuffle className="w-4 h-4 mr-2" /> Shuffle
              </button>
            </div>

            <div className="relative w-full aspect-[4/3] max-h-[55vh] max-w-[700px] mx-auto border-4 border-ink shadow-[8px_8px_0_var(--color-ink)] bg-ink/20 flex-shrink-0">
              
              {isSolved && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center bg-kraft border-4 border-ink p-6 shadow-[8px_8px_0_var(--color-ink)]"
                  >
                    <Sparkles className="w-12 h-12 text-vermilion mb-2" />
                    <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-ink">Excellent!</h2>
                  </motion.div>
                </div>
              )}

              <div 
                className="absolute inset-0 grid" 
                style={{ 
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)` 
                }}
              >
                {pieces.map((pieceIdx, currentPos) => {
                  const originalRow = Math.floor(pieceIdx / cols);
                  const originalCol = pieceIdx % cols;
                  
                  return (
                    <motion.div
                      layout
                      key={pieceIdx}
                      onClick={() => handlePieceClick(currentPos)}
                      className={`relative cursor-pointer box-border transition-all duration-200 ${
                        selectedPiece === currentPos 
                          ? 'border-4 border-vermilion z-10 shadow-xl scale-105' 
                          : 'border-b border-r border-ink/30 hover:border-ink hover:z-10'
                      }`}
                      style={{
                        backgroundImage: `url(${image.src})`,
                        backgroundSize: `${cols * 100}% ${rows * 100}%`,
                        backgroundPosition: `${(originalCol / (cols - 1)) * 100}% ${(originalRow / (rows - 1)) * 100}%`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </GameLayout>
  );
}
