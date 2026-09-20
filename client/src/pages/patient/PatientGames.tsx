import { useAppDataStore } from '@/store/appDataStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { generateTodaysPlan } from '@/lib/adaptiveEngine';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VoiceButton } from '@/components/ui/VoiceButton';


interface GameInfo {
  id: string;
  name: string;
  emoji: string;
  domain: string;
  time: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  bgColor: string;
}

const GAMES_LIST: GameInfo[] = [
  {
    id: 'memory-match',
    name: 'Memory Match',
    emoji: '🃏',
    domain: 'Memory',
    time: '5 min',
    difficulty: 'easy',
    description: 'Find matching pairs of colorful traditional cards at your own pace.',
    bgColor: 'from-amber-50 to-orange-50/60 border-amber-200',
  },
  {
    id: 'remember-objects',
    name: 'Remember the Objects',
    emoji: '👁️',
    domain: 'Memory',
    time: '4 min',
    difficulty: 'easy',
    description: 'Look at peaceful everyday items, remember them when they hide.',
    bgColor: 'from-emerald-50 to-teal-50/60 border-emerald-200',
  },
  {
    id: 'sequence-memory',
    name: 'Sequence Memory',
    emoji: '🔢',
    domain: 'Memory',
    time: '5 min',
    difficulty: 'easy',
    description: 'Follow gentle sequences of glowing lights and calm tones.',
    bgColor: 'from-blue-50 to-indigo-50/60 border-blue-200',
  },
  {
    id: 'find-difference',
    name: 'Find the Difference',
    emoji: '🔍',
    domain: 'Attention',
    time: '5 min',
    difficulty: 'medium',
    description: 'Spot the subtle peaceful difference between two charming scenes.',
    bgColor: 'from-cyan-50 to-sky-50/60 border-cyan-200',
  },
  {
    id: 'sort-my-day',
    name: 'Sort My Day',
    emoji: '📋',
    domain: 'Routine',
    time: '4 min',
    difficulty: 'easy',
    description: 'Organize enjoyable daily morning, tea time, and evening steps.',
    bgColor: 'from-violet-50 to-purple-50/60 border-violet-200',
  },
  {
    id: 'object-recognition',
    name: 'Object Recognition',
    emoji: '🏺',
    domain: 'Recognition',
    time: '4 min',
    difficulty: 'medium',
    description: 'Recognize classic household items and traditional handicrafts.',
    bgColor: 'from-rose-50 to-pink-50/60 border-rose-200',
  },
  {
    id: 'pattern-builder',
    name: 'Pattern Builder',
    emoji: '🔮',
    domain: 'Pattern',
    time: '4 min',
    difficulty: 'easy',
    description: 'Complete lovely regional textile motifs and geometric designs.',
    bgColor: 'from-teal-50 to-emerald-50/60 border-teal-200',
  },
  {
    id: 'attention-tap',
    name: 'Attention Tap',
    emoji: '👆',
    domain: 'Attention',
    time: '4 min',
    difficulty: 'medium',
    description: 'Tap target objects promptly when they appear on the screen.',
    bgColor: 'from-amber-50 to-yellow-50/60 border-amber-200',
  },
  {
    id: 'sound-memory',
    name: 'Sound & Memory',
    emoji: '🎵',
    domain: 'Memory',
    time: '4 min',
    difficulty: 'easy',
    description: 'Listen to birdsong, bells, and river sounds to identify matching pairs.',
    bgColor: 'from-emerald-50 to-green-50/60 border-emerald-200',
  },
  {
    id: 'story-memory',
    name: 'Story Memory',
    emoji: '📖',
    domain: 'Memory',
    time: '6 min',
    difficulty: 'easy',
    description: 'Enjoy a short heartwarming folktale and answer fun recollections.',
    bgColor: 'from-indigo-50 to-blue-50/60 border-indigo-200',
  },
];

export default function PatientGames() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const todaysPlan = generateTodaysPlan(DEMO_GAME_SESSIONS, { maxMinutes: 15 });
  const recommendedIds = new Set(todaysPlan.activities.map((a) => a.gameId));

  const recommendedGames = GAMES_LIST.filter((g) => recommendedIds.has(g.id as any));

  const spokenOverview = `${t('games.title', 'Cognitive Activities')}. ${t(
    'games.subtitle',
    'Fun activities for your mind'
  )}. Choose any activity below to begin playing.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8 patient-mode"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-100 text-teal-800">
            {t('nav.activities', 'Activities')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t('games.title', 'Cognitive Activities')}
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 font-medium">
            {t('games.subtitle', 'Fun activities for your mind')}
          </p>
        </div>

        <VoiceButton
          size="lg"
          textToSpeak={spokenOverview}
          showLabel
          label={t('help.repeat', 'Listen')}
        />
      </div>

      {/* RECOMMENDED TODAY */}
      {recommendedGames.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Recommended Today
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedGames.map((game) => (
              <Card
                key={`rec-${game.id}`}
                variant="colored"
                padding="lg"
                className="border-teal-300 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/patient/game/${game.id}`)}
              >
                <CardBody className="pt-0 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-5xl" role="img" aria-label={game.name}>
                      {game.emoji}
                    </span>
                    <Badge variant="success" size="md">
                      Recommended
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-1">{game.name}</h3>
                    <p className="text-base text-stone-600 line-clamp-2">{game.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-teal-100">
                    <span className="text-sm font-semibold text-teal-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {game.time}
                    </span>
                    <Button variant="primary" size="md" className="font-bold">
                      <Play className="w-4 h-4 mr-1.5 fill-current" />
                      {t('games.start', 'Play')}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ALL 10 COGNITIVE GAMES */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          All Activities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {GAMES_LIST.map((game) => (
            <div
              key={game.id}
              className={`p-6 rounded-3xl border-2 bg-gradient-to-br transition-all duration-150 flex flex-col justify-between shadow-xs hover:shadow-md ${game.bgColor}`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-5xl" role="img" aria-label={game.name}>
                    {game.emoji}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm">
                      {game.domain}
                    </Badge>
                    <Badge
                      variant={
                        game.difficulty === 'easy'
                          ? 'success'
                          : game.difficulty === 'medium'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {t(`games.${game.difficulty}`, game.difficulty)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-stone-900 mb-1.5">
                    {game.name}
                  </h3>
                  <p className="text-base text-stone-600 leading-relaxed font-normal">
                    {game.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 mt-4 border-t border-black/5">
                <span className="text-sm font-semibold text-stone-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {game.time}
                </span>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/patient/game/${game.id}`)}
                  className="font-bold min-h-[3.25rem] px-6 text-lg"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  {t('games.start', 'Play')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
