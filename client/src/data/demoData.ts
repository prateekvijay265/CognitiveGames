import type {
  Patient,
  GameSession,
  Reminder,
  ReminderEvent,
  DailyRoutineItem,
  MemoryBookEntry,
  Alert,
  Note,
  User,
  MoodEntry,
  CognitiveMetric,
} from '../types';

// ============================================================
// DEMO USERS
// ============================================================
export const DEMO_USERS: User[] = [
  {
    id: 'patient-1',
    email: 'patient@demo.neuromind.in',
    name: 'Asha Devi',
    role: 'patient',
    language: 'as',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2026-09-20T06:00:00Z',
  },
  {
    id: 'caregiver-1',
    email: 'caregiver@demo.neuromind.in',
    name: 'Priya Sharma',
    role: 'caregiver',
    language: 'en',
    createdAt: '2025-07-14T08:00:00Z',
    updatedAt: '2026-09-20T07:00:00Z',
  },
  {
    id: 'doctor-1',
    email: 'doctor@demo.neuromind.in',
    name: 'Dr. Ananya Das',
    role: 'doctor',
    language: 'en',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2026-09-20T08:00:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@demo.neuromind.in',
    name: 'Rajiv Borah',
    role: 'admin',
    language: 'en',
    createdAt: '2025-07-01T08:00:00Z',
    updatedAt: '2026-09-20T09:00:00Z',
  },
];

// ============================================================
// DEMO PATIENTS
// ============================================================
export const DEMO_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    userId: 'patient-1',
    name: 'Asha Devi',
    age: 72,
    dateOfBirth: '1954-03-12',
    language: 'as',
    caregivers: ['caregiver-1'],
    healthcareWorkers: ['doctor-1'],
    emergencyContact: { name: 'Priya Sharma', relationship: 'Daughter', phone: '+91 98765 43210' },
    accessibilitySettings: {
      fontSize: 'x-large',
      highContrast: false,
      reducedMotion: false,
      voiceEnabled: true,
      soundEnabled: true,
      hapticEnabled: true,
    },
    difficultyProfile: {
      memoryMatch: 'easy',
      rememberObjects: 'easy',
      sequenceMemory: 'easy',
      findDifference: 'medium',
      sortMyDay: 'easy',
      objectRecognition: 'medium',
      patternBuilder: 'easy',
      attentionTap: 'medium',
      soundMemory: 'easy',
      storyMemory: 'easy',
      recommendedDifficulty: 'easy',
      reason: 'Consistent comfortable performance observed.',
      confidence: 0.78,
    },
    createdAt: '2025-07-15T08:00:00Z',
    lastActiveAt: '2026-09-20T08:30:00Z',
    lastSyncAt: '2026-09-20T08:35:00Z',
    isDemo: true,
  },
  {
    id: 'pat-2',
    userId: 'patient-2',
    name: 'Mohan Basumatary',
    age: 68,
    language: 'en',
    caregivers: ['caregiver-1'],
    healthcareWorkers: ['doctor-1'],
    emergencyContact: { name: 'Deepa Basumatary', relationship: 'Wife', phone: '+91 87654 32109' },
    accessibilitySettings: {
      fontSize: 'large',
      highContrast: false,
      reducedMotion: false,
      voiceEnabled: true,
      soundEnabled: true,
      hapticEnabled: false,
    },
    difficultyProfile: {
      memoryMatch: 'medium',
      rememberObjects: 'medium',
      sequenceMemory: 'medium',
      findDifference: 'medium',
      sortMyDay: 'easy',
      objectRecognition: 'medium',
      patternBuilder: 'medium',
      attentionTap: 'easy',
      soundMemory: 'medium',
      storyMemory: 'medium',
    },
    createdAt: '2025-08-01T08:00:00Z',
    lastActiveAt: '2026-09-19T14:00:00Z',
    lastSyncAt: '2026-09-19T14:05:00Z',
    isDemo: true,
  },
  {
    id: 'pat-3',
    userId: 'patient-3',
    name: 'Lalhmingmawii Sailo',
    age: 75,
    language: 'lus',
    caregivers: ['caregiver-2'],
    healthcareWorkers: ['doctor-1'],
    emergencyContact: { name: 'Remi Sailo', relationship: 'Son', phone: '+91 76543 21098' },
    accessibilitySettings: {
      fontSize: 'x-large',
      highContrast: true,
      reducedMotion: true,
      voiceEnabled: true,
      soundEnabled: false,
      hapticEnabled: true,
    },
    difficultyProfile: {
      memoryMatch: 'easy',
      rememberObjects: 'easy',
      sequenceMemory: 'easy',
      findDifference: 'easy',
      sortMyDay: 'easy',
      objectRecognition: 'easy',
      patternBuilder: 'easy',
      attentionTap: 'easy',
      soundMemory: 'easy',
      storyMemory: 'easy',
    },
    createdAt: '2025-09-01T08:00:00Z',
    lastActiveAt: '2026-09-18T09:00:00Z',
    lastSyncAt: '2026-09-18T09:10:00Z',
    isDemo: true,
  },
  {
    id: 'pat-4',
    userId: 'patient-4',
    name: 'Tombi Singh',
    age: 70,
    language: 'mni',
    caregivers: ['caregiver-2'],
    healthcareWorkers: ['doctor-1'],
    emergencyContact: { name: 'Sangeeta Singh', relationship: 'Daughter', phone: '+91 65432 10987' },
    accessibilitySettings: {
      fontSize: 'large',
      highContrast: false,
      reducedMotion: false,
      voiceEnabled: false,
      soundEnabled: true,
      hapticEnabled: true,
    },
    difficultyProfile: {
      memoryMatch: 'medium',
      rememberObjects: 'easy',
      sequenceMemory: 'easy',
      findDifference: 'medium',
      sortMyDay: 'medium',
      objectRecognition: 'medium',
      patternBuilder: 'medium',
      attentionTap: 'medium',
      soundMemory: 'medium',
      storyMemory: 'easy',
    },
    createdAt: '2025-10-01T08:00:00Z',
    lastActiveAt: '2026-09-20T07:00:00Z',
    lastSyncAt: '2026-09-20T07:05:00Z',
    isDemo: true,
  },
  {
    id: 'pat-5',
    userId: 'patient-5',
    name: 'Biren Khongmei',
    age: 65,
    language: 'en',
    caregivers: ['caregiver-1'],
    healthcareWorkers: ['doctor-1'],
    emergencyContact: { name: 'Rita Khongmei', relationship: 'Wife', phone: '+91 54321 09876' },
    accessibilitySettings: {
      fontSize: 'normal',
      highContrast: false,
      reducedMotion: false,
      voiceEnabled: true,
      soundEnabled: true,
      hapticEnabled: false,
    },
    difficultyProfile: {
      memoryMatch: 'hard',
      rememberObjects: 'medium',
      sequenceMemory: 'hard',
      findDifference: 'hard',
      sortMyDay: 'medium',
      objectRecognition: 'hard',
      patternBuilder: 'hard',
      attentionTap: 'medium',
      soundMemory: 'medium',
      storyMemory: 'medium',
    },
    createdAt: '2025-11-01T08:00:00Z',
    lastActiveAt: '2026-09-20T09:00:00Z',
    lastSyncAt: '2026-09-20T09:05:00Z',
    isDemo: true,
  },
];

// ============================================================
// GENERATE GAME SESSIONS (100+ over past 4 weeks)
// ============================================================
function generateSessions(): GameSession[] {
  const sessions: GameSession[] = [];
  const gameIds = [
    'memory-match', 'remember-objects', 'sequence-memory', 'find-difference',
    'sort-my-day', 'object-recognition', 'pattern-builder', 'attention-tap',
    'sound-memory', 'story-memory',
  ] as const;

  const domains = {
    'memory-match': 'memory',
    'remember-objects': 'memory',
    'sequence-memory': 'memory',
    'find-difference': 'attention',
    'sort-my-day': 'routine-recall',
    'object-recognition': 'recognition',
    'pattern-builder': 'pattern-reasoning',
    'attention-tap': 'attention',
    'sound-memory': 'memory',
    'story-memory': 'memory',
  } as const;

  const patientIds = ['pat-1', 'pat-2', 'pat-3', 'pat-4', 'pat-5'];

  // Generate 4 weeks of sessions
  for (let daysAgo = 28; daysAgo >= 0; daysAgo--) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    for (const patientId of patientIds) {
      // 2-4 sessions per patient per day
      const sessionsPerDay = Math.floor(Math.random() * 3) + 2;
      for (let s = 0; s < sessionsPerDay; s++) {
        const gameId = gameIds[Math.floor(Math.random() * gameIds.length)];
        const hour = 8 + Math.floor(Math.random() * 10);
        const sessionDate = new Date(date);
        sessionDate.setHours(hour, Math.floor(Math.random() * 60));

        // Slightly improving trend for demonstration
        const baseAccuracy = patientId === 'pat-1' ? 72 : patientId === 'pat-5' ? 85 : 68;
        const trend = daysAgo > 14 ? -5 : 0;
        const accuracy = Math.min(100, Math.max(20, baseAccuracy + trend + (Math.random() * 20 - 10)));

        sessions.push({
          id: `session-${patientId}-${daysAgo}-${s}`,
          gameId: gameId as typeof gameIds[number],
          patientId,
          sessionId: `ses-${patientId}-${daysAgo}-${s}`,
          startedAt: sessionDate.toISOString(),
          completedAt: new Date(sessionDate.getTime() + (3 + Math.random() * 7) * 60000).toISOString(),
          difficulty: daysAgo > 21 ? 'easy' : daysAgo > 14 ? 'easy' : daysAgo > 7 ? 'medium' : 'medium',
          accuracy: Math.round(accuracy),
          responseTimeMs: Math.round(4000 + Math.random() * 6000),
          hintsUsed: Math.floor(Math.random() * 3),
          mistakes: Math.floor(Math.random() * 4),
          score: Math.round(accuracy * 10),
          totalQuestions: 10,
          answeredQuestions: Math.floor(8 + Math.random() * 3),
          completed: Math.random() > 0.1,
          abandoned: Math.random() < 0.05,
          cognitiveDomain: domains[gameId],
          language: 'en',
          offline: Math.random() < 0.15,
          syncStatus: 'synced',
        });
      }
    }
  }

  return sessions;
}

export const DEMO_GAME_SESSIONS = generateSessions();

// ============================================================
// DEMO REMINDERS
// ============================================================
export const DEMO_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    patientId: 'pat-1',
    type: 'medicine',
    title: 'Morning Medicine',
    description: 'Take prescribed morning medicine with water',
    scheduledTime: '08:00',
    repeatSchedule: { type: 'daily' },
    voiceEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    caregiverNotify: true,
    isActive: true,
    createdAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'rem-2',
    patientId: 'pat-1',
    type: 'hydration',
    title: 'Drink Water',
    description: 'Have a glass of water',
    scheduledTime: '10:00',
    repeatSchedule: { type: 'daily' },
    voiceEnabled: true,
    soundEnabled: true,
    vibrationEnabled: false,
    caregiverNotify: false,
    isActive: true,
    createdAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'rem-3',
    patientId: 'pat-1',
    type: 'meal',
    title: 'Lunch Time',
    description: 'Time for your midday meal',
    scheduledTime: '13:00',
    repeatSchedule: { type: 'daily' },
    voiceEnabled: true,
    soundEnabled: true,
    vibrationEnabled: false,
    caregiverNotify: false,
    isActive: true,
    createdAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'rem-4',
    patientId: 'pat-1',
    type: 'medicine',
    title: 'Evening Medicine',
    description: 'Take prescribed evening medicine',
    scheduledTime: '18:00',
    repeatSchedule: { type: 'daily' },
    voiceEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    caregiverNotify: true,
    isActive: true,
    createdAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'rem-5',
    patientId: 'pat-1',
    type: 'exercise',
    title: 'Evening Walk',
    description: 'Short walk in the garden',
    scheduledTime: '17:00',
    repeatSchedule: { type: 'daily' },
    voiceEnabled: true,
    soundEnabled: false,
    vibrationEnabled: false,
    caregiverNotify: false,
    isActive: true,
    createdAt: '2025-07-16T08:00:00Z',
  },
];

// ============================================================
// DEMO DAILY ROUTINE
// ============================================================
export const DEMO_ROUTINE: DailyRoutineItem[] = [
  { id: 'r-1', patientId: 'pat-1', title: 'Wake Up', icon: '☀️', scheduledTime: '07:00', category: 'morning', order: 1 },
  { id: 'r-2', patientId: 'pat-1', title: 'Drink Water', icon: '💧', scheduledTime: '07:15', category: 'morning', order: 2 },
  { id: 'r-3', patientId: 'pat-1', title: 'Breakfast', icon: '🍽', scheduledTime: '08:00', category: 'morning', order: 3 },
  { id: 'r-4', patientId: 'pat-1', title: 'Morning Medicine', icon: '💊', scheduledTime: '08:30', category: 'morning', order: 4 },
  { id: 'r-5', patientId: 'pat-1', title: 'Morning Walk', icon: '🚶', scheduledTime: '09:00', category: 'morning', order: 5 },
  { id: 'r-6', patientId: 'pat-1', title: 'Brain Activity', icon: '🧠', scheduledTime: '10:00', category: 'morning', order: 6 },
  { id: 'r-7', patientId: 'pat-1', title: 'Lunch', icon: '🍛', scheduledTime: '13:00', category: 'afternoon', order: 7 },
  { id: 'r-8', patientId: 'pat-1', title: 'Rest', icon: '😴', scheduledTime: '14:00', category: 'afternoon', order: 8 },
  { id: 'r-9', patientId: 'pat-1', title: 'Evening Activity', icon: '🌆', scheduledTime: '16:00', category: 'evening', order: 9 },
  { id: 'r-10', patientId: 'pat-1', title: 'Evening Walk', icon: '🌳', scheduledTime: '17:00', category: 'evening', order: 10 },
  { id: 'r-11', patientId: 'pat-1', title: 'Dinner', icon: '🍽', scheduledTime: '19:00', category: 'evening', order: 11 },
  { id: 'r-12', patientId: 'pat-1', title: 'Evening Medicine', icon: '💊', scheduledTime: '19:30', category: 'evening', order: 12 },
  { id: 'r-13', patientId: 'pat-1', title: 'Sleep', icon: '🌙', scheduledTime: '21:00', category: 'night', order: 13 },
];

// ============================================================
// DEMO MEMORY BOOK
// ============================================================
export const DEMO_MEMORY_BOOK: MemoryBookEntry[] = [
  {
    id: 'mb-1',
    patientId: 'pat-1',
    personName: 'Priya',
    relationship: 'Daughter',
    story: 'Priya visits every Sunday. She loves making tea for everyone.',
    date: '2025-12-25',
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'mb-2',
    patientId: 'pat-1',
    personName: 'Rohan',
    relationship: 'Grandson',
    story: 'Rohan is 8 years old. He loves to play in the garden.',
    date: '2026-01-15',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'mb-3',
    patientId: 'pat-1',
    personName: 'The Old Tea Garden',
    relationship: 'Childhood Memory',
    story: 'Our family tea garden near the hills. We would pick leaves every morning.',
    date: '1975-06-01',
    createdAt: '2026-02-01T08:00:00Z',
  },
];

// ============================================================
// DEMO ALERTS
// ============================================================
export const DEMO_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    patientId: 'pat-1',
    type: 'missed-reminders',
    severity: 'attention',
    title: 'Missed Reminders',
    message: 'Asha missed 2 reminders yesterday. Consider checking in.',
    isRead: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'alert-2',
    patientId: 'pat-3',
    type: 'low-activity',
    severity: 'attention',
    title: 'Lower Activity Than Usual',
    message: 'Lalhmingmawii\'s activity has been lower than usual during the last 7 days.',
    isRead: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'alert-3',
    patientId: 'pat-2',
    type: 'game-abandoned',
    severity: 'info',
    title: 'Activity Not Completed',
    message: 'Mohan did not complete his last 3 activities. No concern at this time.',
    isRead: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// DEMO NOTES
// ============================================================
export const DEMO_NOTES: Note[] = [
  {
    id: 'note-1',
    patientId: 'pat-1',
    authorId: 'caregiver-1',
    authorName: 'Priya Sharma',
    authorRole: 'caregiver',
    content: 'Asha seemed a bit tired today but completed all morning reminders. She enjoyed the Memory Match activity.',
    isPrivate: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-2',
    patientId: 'pat-1',
    authorId: 'doctor-1',
    authorName: 'Dr. Ananya Das',
    authorRole: 'doctor',
    content: 'Review of 4-week activity report. Asha shows consistent engagement. Recommend continuing current routine. Follow up in 4 weeks.',
    isPrivate: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// DEMO MOOD ENTRIES
// ============================================================
export const DEMO_MOOD_ENTRIES: MoodEntry[] = Array.from({ length: 14 }, (_, i) => ({
  id: `mood-${i}`,
  patientId: 'pat-1',
  mood: (['great', 'good', 'good', 'okay', 'good', 'great', 'okay'] as const)[i % 7],
  recordedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  syncStatus: 'synced' as const,
}));

// ============================================================
// DEMO COGNITIVE METRICS (weekly aggregates)
// ============================================================
export const DEMO_COGNITIVE_METRICS: CognitiveMetric[] = Array.from({ length: 28 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const base = 68 + (28 - i) * 0.3;
  return {
    id: `metric-pat1-${i}`,
    patientId: 'pat-1',
    date: date.toISOString().split('T')[0],
    domain: 'memory',
    averageAccuracy: Math.min(95, Math.round(base + Math.random() * 10 - 5)),
    averageResponseTimeMs: Math.round(5000 + Math.random() * 2000),
    sessionsCount: Math.floor(2 + Math.random() * 3),
    hintsUsed: Math.floor(Math.random() * 3),
    completionRate: 0.8 + Math.random() * 0.2,
  };
});

// ============================================================
// DEMO AUTH CREDENTIALS (for display on login page)
// ============================================================
export const DEMO_CREDENTIALS = [
  { role: 'Patient', email: 'patient@demo.neuromind.in', password: 'Demo@1234', icon: '🧠', color: 'teal' },
  { role: 'Caregiver', email: 'caregiver@demo.neuromind.in', password: 'Demo@1234', icon: '💚', color: 'blue' },
  { role: 'Doctor', email: 'doctor@demo.neuromind.in', password: 'Demo@1234', icon: '🩺', color: 'purple' },
  { role: 'Admin', email: 'admin@demo.neuromind.in', password: 'Demo@1234', icon: '⚡', color: 'amber' },
];

