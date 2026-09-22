import { useAppDataStore } from '@/store/appDataStore';
import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { db } from '@/lib/db';
import { voiceService } from '@/services/voice';
import type { GameDifficulty, GameSession, SupportedLanguage } from '@/types';
import {
  MemoryMatch,
  RememberObjects,
  SequenceMemory,
  FindDifference,
  SortMyDay,
  ObjectRecognition,
  PatternBuilder,
  AttentionTap,
  SoundMemory,
  StoryMemory,
  Chess,
  Match3,
  MemoryGame,
  Sudoku,
  JigsawGame,
} from '@/features/games';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from 'sonner';


export default function GamePlayer() {
  const { patients: DEMO_PATIENTS } = useAppDataStore();

  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const patient = DEMO_PATIENTS[0];
  const patientId = patient.id;
  const currentLang = (i18n.language as SupportedLanguage) || 'en';

  // Map kebab-case gameId to difficulty profile camelCase key
  const difficultyMap: Record<string, any> = {
    'memory-match': 'memoryMatch',
    'remember-objects': 'rememberObjects',
    'sequence-memory': 'sequenceMemory',
    'find-difference': 'findDifference',
    'sort-my-day': 'sortMyDay',
    'object-recognition': 'objectRecognition',
    'pattern-builder': 'patternBuilder',
    'attention-tap': 'attentionTap',
    'sound-memory': 'soundMemory',
    'story-memory': 'storyMemory',
    'chess': 'chess',
    'match3': 'match3',
    'memory-game': 'memoryGame',
    'sudoku': 'sudoku',
    'jigsaw': 'jigsaw',
  };

  const profileKey = gameId ? difficultyMap[gameId] : undefined;
  const difficulty: GameDifficulty = profileKey ? (patient.difficultyProfile as any)[profileKey] || 'medium' : 'medium';

  const handleExit = useCallback(() => {
    navigate('/patient/games');
  }, [navigate]);

  const handleComplete = useCallback(
    async (session: GameSession) => {
      toast.success(t('games.well_done', 'Well done! Wonderful effort!'));

      try {
        await db.gameSessions.add(session);
      } catch (err) {
        console.error('Failed to store session in IndexedDB:', err);
      }

      voiceService.speak(t('games.wonderful', 'Wonderful effort! Well done!'));
    },
    [t]
  );

  const renderGame = () => {
    const commonProps = {
      difficulty,
      patientId,
      language: currentLang,
      onComplete: handleComplete,
      onExit: handleExit,
    };

    switch (gameId) {
      case 'memory-match':
        return <MemoryMatch {...commonProps} />;
      case 'remember-objects':
        return <RememberObjects {...commonProps} />;
      case 'sequence-memory':
        return <SequenceMemory {...commonProps} />;
      case 'find-difference':
        return <FindDifference {...commonProps} />;
      case 'sort-my-day':
        return <SortMyDay {...commonProps} />;
      case 'object-recognition':
        return <ObjectRecognition {...commonProps} />;
      case 'pattern-builder':
        return <PatternBuilder {...commonProps} />;
      case 'attention-tap':
        return <AttentionTap {...commonProps} />;
      case 'sound-memory':
        return <SoundMemory {...commonProps} />;
      case 'story-memory':
        return <StoryMemory {...commonProps} />;
      case 'chess':
        return <Chess onExit={handleExit} muted={false} onMute={() => {}} />;
      case 'match3':
        return <Match3 onExit={handleExit} muted={false} onMute={() => {}} />;
      case 'memory-game':
        return <MemoryGame onExit={handleExit} />;
      case 'sudoku':
        return <Sudoku onExit={handleExit} />;
      case 'jigsaw':
        return <JigsawGame onExit={handleExit} muted={false} onMute={() => {}} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center p-6">
            <EmptyState
              title="Activity Not Found"
              description="We could not find the cognitive activity you selected. Let's return to the activities catalog."
              action={{
                label: 'Back to Activities',
                onClick: handleExit,
                variant: 'primary',
              }}
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#FDFBF7] overflow-y-auto patient-mode select-none flex flex-col"
    >
      <div className="flex-1 relative z-10 pb-32">
         {renderGame()}
      </div>

      {/* Persistent Landscape Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-0 overflow-hidden">
         {/* Light Green Hill (Back) */}
         <div className="absolute bottom-6 -left-4 w-48 h-24 bg-[#75A586] rounded-t-full rotate-[-15deg] opacity-60"></div>
         
         {/* Medium Green Hill (Right) */}
         <div className="absolute -bottom-4 -right-12 w-64 h-32 bg-[#5E947A] rounded-t-full rotate-[10deg] opacity-80"></div>
         
         {/* Dark Green Ground (Front) */}
         <div className="absolute -bottom-10 -left-10 right-0 h-24 bg-[#3E705C] rounded-t-[50%] scale-x-125"></div>
      </div>
    </motion.div>
  );
}
