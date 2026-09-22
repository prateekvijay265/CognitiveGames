// Core types for the Neuro Mind platform

export type UserRole = 'patient' | 'caregiver' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  language: SupportedLanguage;
  createdAt: string;
  updatedAt: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'as' | 'mni' | 'kha' | 'lus';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  age: number;
  dateOfBirth?: string;
  language: SupportedLanguage;
  profilePhotoUrl?: string;
  emergencyContact?: EmergencyContact;
  accessibilitySettings: AccessibilitySettings;
  difficultyProfile: DifficultyProfile;
  caregivers: string[];
  healthcareWorkers: string[];
  createdAt: string;
  lastActiveAt?: string;
  lastSyncAt?: string;
  isDemo?: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  reducedMotion: boolean;
  voiceEnabled: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export interface DifficultyProfile {
  memoryMatch: GameDifficulty;
  rememberObjects: GameDifficulty;
  sequenceMemory: GameDifficulty;
  findDifference: GameDifficulty;
  sortMyDay: GameDifficulty;
  objectRecognition: GameDifficulty;
  patternBuilder: GameDifficulty;
  attentionTap: GameDifficulty;
  soundMemory: GameDifficulty;
  storyMemory: GameDifficulty;
  recommendedDifficulty?: GameDifficulty;
  reason?: string;
  confidence?: number;
  updatedAt?: string;
}

export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'adaptive';

export type GameId =
  | 'memory-match'
  | 'remember-objects'
  | 'sequence-memory'
  | 'find-difference'
  | 'sort-my-day'
  | 'object-recognition'
  | 'pattern-builder'
  | 'attention-tap'
  | 'sound-memory'
  | 'story-memory'
  | 'daily-life-simulator';

export type CognitiveDomain =
  | 'memory'
  | 'attention'
  | 'executive-function'
  | 'recognition'
  | 'routine-recall'
  | 'pattern-reasoning'
  | 'emotional-engagement';

export interface Game {
  id: GameId;
  name: string;
  description: string;
  cognitiveDomain: CognitiveDomain;
  icon: string;
  color: string;
  estimatedMinutes: number;
  isAvailableOffline: boolean;
}

export interface GameSession {
  id: string;
  gameId: GameId;
  patientId: string;
  sessionId: string;
  startedAt: string;
  completedAt?: string;
  difficulty: GameDifficulty;
  accuracy: number;
  responseTimeMs: number;
  hintsUsed: number;
  mistakes: number;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  completed: boolean;
  abandoned: boolean;
  cognitiveDomain: CognitiveDomain;
  language: SupportedLanguage;
  offline: boolean;
  syncStatus: SyncStatus;
  metadata?: Record<string, unknown>;
}

export type SyncStatus = 'synced' | 'pending' | 'failed' | 'local';

export interface Reminder {
  id: string;
  patientId: string;
  type: ReminderType;
  title: string;
  description?: string;
  scheduledTime: string;
  repeatSchedule?: RepeatSchedule;
  voiceEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  caregiverNotify: boolean;
  isActive: boolean;
  createdAt: string;
}

export type ReminderType =
  | 'medicine'
  | 'hydration'
  | 'activity'
  | 'appointment'
  | 'meal'
  | 'sleep'
  | 'exercise'
  | 'social';

export interface RepeatSchedule {
  type: 'daily' | 'weekly' | 'custom';
  days?: number[];
  interval?: number;
}

export interface ReminderEvent {
  id: string;
  reminderId: string;
  patientId: string;
  scheduledAt: string;
  acknowledgedAt?: string;
  status: 'pending' | 'done' | 'snoozed' | 'missed' | 'skipped';
  snoozeUntil?: string;
  syncStatus: SyncStatus;
}

export interface DailyRoutineItem {
  id: string;
  patientId: string;
  title: string;
  icon: string;
  scheduledTime: string;
  category: string;
  order: number;
  isCompleted?: boolean;
  completedAt?: string;
}

export interface CognitiveMetric {
  id: string;
  patientId: string;
  date: string;
  domain: CognitiveDomain;
  averageAccuracy: number;
  averageResponseTimeMs: number;
  sessionsCount: number;
  hintsUsed: number;
  completionRate: number;
}

export interface Alert {
  id: string;
  patientId: string;
  type: AlertType;
  severity: 'info' | 'attention' | 'urgent';
  title: string;
  message: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export type AlertType =
  | 'missed-reminders'
  | 'low-activity'
  | 'game-abandoned'
  | 'offline-long'
  | 'sync-failure'
  | 'mood-concern'
  | 'performance-change';

export interface Note {
  id: string;
  patientId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryBookEntry {
  id: string;
  patientId: string;
  personName: string;
  relationship: string;
  photoUrl?: string;
  location?: string;
  story?: string;
  voiceNoteUrl?: string;
  date?: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  patientId: string;
  mood: MoodType;
  note?: string;
  recordedAt: string;
  syncStatus: SyncStatus;
}

export type MoodType = 'great' | 'good' | 'okay' | 'sad' | 'worried';

export interface SyncEvent {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
  syncedAt?: string;
  status: SyncStatus;
  retries: number;
  deviceId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  activePatients: number;
  todayActivities: number;
  reminderCompletion: number;
  pendingAlerts: number;
}

export interface PatientSummary {
  patient: Patient;
  todayProgress: number;
  totalActivitiesToday: number;
  completedActivitiesToday: number;
  lastGameSession?: GameSession;
  pendingReminders: number;
  completedReminders: number;
  latestAlert?: Alert;
  lastActiveAt?: string;
  weeklyTrend: number[];
}

export interface TodaysPlan {
  activities: PlanActivity[];
  generatedAt: string;
  reason: string;
}

export interface PlanActivity {
  gameId: GameId;
  gameName: string;
  estimatedMinutes: number;
  domain: CognitiveDomain;
  difficulty: GameDifficulty;
  priority: number;
}

export interface GameQuestion {
  id: string;
  gameId: GameId;
  language: SupportedLanguage;
  question?: string;
  options?: string[];
  correctAnswer?: string | string[];
  difficulty: GameDifficulty;
  category?: string;
  assetUrl?: string;
  audioUrl?: string;
  region?: string;
}

export interface VoiceConfig {
  enabled: boolean;
  language: SupportedLanguage;
  rate: number;
  pitch: number;
  volume: number;
}

export type NotificationStatus = 'online' | 'offline' | 'syncing' | 'synced' | 'sync-error';

