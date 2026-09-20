import type { GameSession, GameDifficulty, GameId } from '../types';
import { average, rollingMedian, clamp } from './utils';

interface AdaptiveResult {
  currentDifficulty: GameDifficulty;
  recommendedDifficulty: GameDifficulty;
  confidence: number;
  reason: string;
  adjustment: 'increase' | 'decrease' | 'maintain';
}

interface AdaptiveInputs {
  recentSessions: GameSession[];
  currentDifficulty: GameDifficulty;
  gameId: GameId;
}

const DIFFICULTY_LEVELS: GameDifficulty[] = ['easy', 'medium', 'hard'];

function getDifficultyIndex(difficulty: GameDifficulty): number {
  return DIFFICULTY_LEVELS.indexOf(difficulty);
}

function getDifficultyFromIndex(index: number): GameDifficulty {
  return DIFFICULTY_LEVELS[clamp(index, 0, DIFFICULTY_LEVELS.length - 1)];
}

export function calculateAdaptiveDifficulty(inputs: AdaptiveInputs): AdaptiveResult {
  const { recentSessions, currentDifficulty, gameId } = inputs;

  // Filter to only this game's sessions from the last 2 weeks
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const gameSessions = recentSessions
    .filter((s) => s.gameId === gameId && new Date(s.startedAt) > twoWeeksAgo && s.completed)
    .slice(-10); // Last 10 completed sessions

  if (gameSessions.length < 3) {
    // Not enough data to adapt
    return {
      currentDifficulty,
      recommendedDifficulty: currentDifficulty,
      confidence: 0.3,
      reason: 'Not enough activity data yet. Difficulty remains the same.',
      adjustment: 'maintain',
    };
  }

  const accuracies = gameSessions.map((s) => s.accuracy);
  const responseTimes = gameSessions.map((s) => s.responseTimeMs);
  const hintsUsed = gameSessions.map((s) => s.hintsUsed);
  const abandoned = recentSessions
    .filter((s) => s.gameId === gameId && !s.completed && s.abandoned)
    .slice(-5);

  const recentAccuracy = average(accuracies.slice(-5));
  const medianAccuracy = rollingMedian(accuracies, 7);
  const recentResponseTime = average(responseTimes.slice(-5));
  const avgHints = average(hintsUsed.slice(-5));
  const abandonRate = abandoned.length / (gameSessions.length + abandoned.length);

  const currentIndex = getDifficultyIndex(currentDifficulty);

  // Frustration indicators
  const highAbandonRate = abandonRate > 0.3;
  const manyHints = avgHints > 3;
  const lowAccuracy = recentAccuracy < 45;
  const veryLowAccuracy = recentAccuracy < 30;

  // Success indicators
  const highAccuracy = recentAccuracy >= 85;
  const consistentlyHigh = medianAccuracy >= 80;
  const fastResponse = recentResponseTime < getExpectedResponseTime(currentDifficulty) * 0.75;

  // Consecutive successes/failures
  const lastFive = accuracies.slice(-5);
  const consecutiveSuccess = lastFive.every((a) => a >= 80);
  const consecutiveFailure = lastFive.every((a) => a < 50);

  let adjustment: 'increase' | 'decrease' | 'maintain' = 'maintain';
  let reason = '';
  let confidence = 0.6;

  if (veryLowAccuracy || (lowAccuracy && highAbandonRate)) {
    adjustment = 'decrease';
    reason = 'Recent activity performance was a little challenging. Let\'s try a slightly easier version.';
    confidence = 0.85;
  } else if (lowAccuracy || highAbandonRate || manyHints) {
    adjustment = 'decrease';
    reason = 'Adjusting to a more comfortable level based on recent performance.';
    confidence = 0.7;
  } else if (consecutiveSuccess && highAccuracy && fastResponse) {
    adjustment = 'increase';
    reason = 'Excellent recent performance! The activity has been made a little more interesting.';
    confidence = 0.9;
  } else if (highAccuracy && consistentlyHigh) {
    adjustment = 'increase';
    reason = 'Consistent strong performance. Adding a bit more challenge.';
    confidence = 0.75;
  } else if (consecutiveFailure) {
    adjustment = 'decrease';
    reason = 'Making the activity a bit more comfortable.';
    confidence = 0.8;
  } else {
    adjustment = 'maintain';
    reason = 'Performance is steady. Keeping the current level.';
    confidence = 0.65;
  }

  const newIndex =
    adjustment === 'increase'
      ? Math.min(currentIndex + 1, DIFFICULTY_LEVELS.length - 1)
      : adjustment === 'decrease'
      ? Math.max(currentIndex - 1, 0)
      : currentIndex;

  return {
    currentDifficulty,
    recommendedDifficulty: getDifficultyFromIndex(newIndex),
    confidence,
    reason,
    adjustment,
  };
}

function getExpectedResponseTime(difficulty: GameDifficulty): number {
  const times: Record<GameDifficulty, number> = {
    easy: 8000,
    medium: 6000,
    hard: 4000,
    adaptive: 6000,
  };
  return times[difficulty];
}

export function generateTodaysPlan(
  recentSessions: GameSession[],
  preferences?: {
    preferredGames?: GameId[];
    maxMinutes?: number;
    language?: string;
  }
) {
  const { maxMinutes = 25 } = preferences ?? {};

  const gameMetadata = [
    { gameId: 'memory-match' as GameId, domain: 'memory', minutes: 5 },
    { gameId: 'remember-objects' as GameId, domain: 'memory', minutes: 4 },
    { gameId: 'sequence-memory' as GameId, domain: 'memory', minutes: 5 },
    { gameId: 'pattern-builder' as GameId, domain: 'pattern-reasoning', minutes: 4 },
    { gameId: 'attention-tap' as GameId, domain: 'attention', minutes: 4 },
    { gameId: 'story-memory' as GameId, domain: 'memory', minutes: 6 },
    { gameId: 'sort-my-day' as GameId, domain: 'routine-recall', minutes: 4 },
    { gameId: 'object-recognition' as GameId, domain: 'recognition', minutes: 4 },
    { gameId: 'find-difference' as GameId, domain: 'attention', minutes: 5 },
    { gameId: 'sound-memory' as GameId, domain: 'memory', minutes: 4 },
  ];

  // Track which games were played recently (avoid excessive repetition)
  const today = new Date().toDateString();
  const recentGameIds = new Set(
    recentSessions
      .filter((s) => new Date(s.startedAt).toDateString() === today)
      .map((s) => s.gameId)
  );

  // Score games by: not played today, variety of domains
  const domainsUsed = new Set<string>();
  const selected = [];
  let totalMinutes = 0;

  // Prioritize: not played today, different domains
  const sorted = gameMetadata.sort((a, b) => {
    const aPlayed = recentGameIds.has(a.gameId) ? 1 : 0;
    const bPlayed = recentGameIds.has(b.gameId) ? 1 : 0;
    return aPlayed - bPlayed;
  });

  for (const game of sorted) {
    if (totalMinutes + game.minutes > maxMinutes) continue;
    if (selected.length >= 4) break;
    if (domainsUsed.has(game.domain) && selected.length < 2) continue;

    selected.push({
      gameId: game.gameId,
      gameName: game.gameId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      estimatedMinutes: game.minutes,
      domain: game.domain,
      difficulty: 'adaptive' as GameDifficulty,
      priority: selected.length + 1,
    });
    domainsUsed.add(game.domain);
    totalMinutes += game.minutes;
  }

  return {
    activities: selected,
    generatedAt: new Date().toISOString(),
    reason: 'Activities selected based on your recent performance and variety.',
  };
}
