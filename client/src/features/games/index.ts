import type { Game, GameId } from '../../types';

// Export GameEngine and Core Hooks & Components
export * from './GameEngine';

// Export All 10 Cognitive Games
export { MemoryMatch } from './MemoryMatch/MemoryMatch';
export type { MemoryMatchProps } from './MemoryMatch/MemoryMatch';

export { RememberObjects } from './RememberObjects/RememberObjects';
export type { RememberObjectsProps } from './RememberObjects/RememberObjects';

export { SequenceMemory } from './SequenceMemory/SequenceMemory';
export type { SequenceMemoryProps } from './SequenceMemory/SequenceMemory';

export { FindDifference } from './FindDifference/FindDifference';
export type { FindDifferenceProps } from './FindDifference/FindDifference';

export { SortMyDay } from './SortMyDay/SortMyDay';
export type { SortMyDayProps } from './SortMyDay/SortMyDay';

export { ObjectRecognition } from './ObjectRecognition/ObjectRecognition';
export type { ObjectRecognitionProps } from './ObjectRecognition/ObjectRecognition';

export { PatternBuilder } from './PatternBuilder/PatternBuilder';
export type { PatternBuilderProps } from './PatternBuilder/PatternBuilder';

export { AttentionTap } from './AttentionTap/AttentionTap';
export type { AttentionTapProps } from './AttentionTap/AttentionTap';

export { SoundMemory } from './SoundMemory/SoundMemory';
export type { SoundMemoryProps } from './SoundMemory/SoundMemory';

export { StoryMemory } from './StoryMemory/StoryMemory';
export type { StoryMemoryProps } from './StoryMemory/StoryMemory';

// Comprehensive metadata for all 10 cognitive games
export const ALL_COGNITIVE_GAMES: Game[] = [
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Find matching pairs of culturally familiar cards to stimulate visual memory.',
    cognitiveDomain: 'memory',
    icon: 'Sparkles',
    color: '#D97706', // amber-600
    estimatedMinutes: 3,
    isAvailableOffline: true,
  },
  {
    id: 'remember-objects',
    name: 'Remember Objects',
    description: 'Observe everyday items before they hide and pick which ones you remember.',
    cognitiveDomain: 'memory',
    icon: 'Eye',
    color: '#059669', // emerald-600
    estimatedMinutes: 4,
    isAvailableOffline: true,
  },
  {
    id: 'sequence-memory',
    name: 'Sequence Memory',
    description: 'Follow step-by-step cultural routines and tap items back in order.',
    cognitiveDomain: 'routine-recall',
    icon: 'ListOrdered',
    color: '#2563EB', // blue-600
    estimatedMinutes: 4,
    isAvailableOffline: true,
  },
  {
    id: 'find-difference',
    name: 'Find the Difference',
    description: 'Compare side-by-side scenes of Assam and tap gentle differences.',
    cognitiveDomain: 'attention',
    icon: 'Search',
    color: '#7C3AED', // violet-600
    estimatedMinutes: 5,
    isAvailableOffline: true,
  },
  {
    id: 'sort-my-day',
    name: 'Sort My Day',
    description: 'Arrange daily activities from morning tea to nighttime rest.',
    cognitiveDomain: 'routine-recall',
    icon: 'Calendar',
    color: '#EA580C', // orange-600
    estimatedMinutes: 3,
    isAvailableOffline: true,
  },
  {
    id: 'object-recognition',
    name: 'Object Recognition',
    description: 'Identify traditional objects, plants, and animals of North-Eastern heritage.',
    cognitiveDomain: 'recognition',
    icon: 'HelpCircle',
    color: '#0D9488', // teal-600
    estimatedMinutes: 3,
    isAvailableOffline: true,
  },
  {
    id: 'pattern-builder',
    name: 'Pattern Builder',
    description: 'Discover the repeating sequence rhythm and select the missing piece.',
    cognitiveDomain: 'pattern-reasoning',
    icon: 'Grid',
    color: '#4F46E5', // indigo-600
    estimatedMinutes: 4,
    isAvailableOffline: true,
  },
  {
    id: 'attention-tap',
    name: 'Attention Tap',
    description: 'Scan the collection and tap only items matching the gentle rule.',
    cognitiveDomain: 'attention',
    icon: 'Target',
    color: '#E11D48', // rose-600
    estimatedMinutes: 3,
    isAvailableOffline: true,
  },
  {
    id: 'sound-memory',
    name: 'Sound Memory',
    description: 'Listen to soothing tones and descriptions, then choose the matching scene.',
    cognitiveDomain: 'recognition',
    icon: 'Volume2',
    color: '#0284C7', // sky-600
    estimatedMinutes: 3,
    isAvailableOffline: true,
  },
  {
    id: 'story-memory',
    name: 'Story Memory',
    description: 'Read or listen to a warm traditional story and answer gentle recall questions.',
    cognitiveDomain: 'memory',
    icon: 'BookOpen',
    color: '#B45309', // amber-700
    estimatedMinutes: 5,
    isAvailableOffline: true,
  },
];

export function getGameMetadata(id: GameId): Game | undefined {
  return ALL_COGNITIVE_GAMES.find((g) => g.id === id);
}

export { default as Chess } from './Chess';
export { default as Match3 } from './Match3';
export { default as MemoryGame } from './Memory';
export { default as Sudoku } from './Sudoku';
export { default as JigsawGame } from './JigsawGame';
