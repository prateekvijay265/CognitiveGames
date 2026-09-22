import Dexie, { type Table } from 'dexie';
import type {
  GameSession,
  ReminderEvent,
  MoodEntry,
  SyncEvent,
  Patient,
  Reminder,
  DailyRoutineItem,
  MemoryBookEntry,
  Alert,
  Note,
  CognitiveMetric,
} from '../types';

export class NeuroMindDB extends Dexie {
  // Tables
  patients!: Table<Patient, string>;
  gameSessions!: Table<GameSession, string>;
  reminders!: Table<Reminder, string>;
  reminderEvents!: Table<ReminderEvent, string>;
  routineItems!: Table<DailyRoutineItem, string>;
  memoryBook!: Table<MemoryBookEntry, string>;
  moodEntries!: Table<MoodEntry, string>;
  alerts!: Table<Alert, string>;
  notes!: Table<Note, string>;
  cognitiveMetrics!: Table<CognitiveMetric, string>;
  syncQueue!: Table<SyncEvent, string>;
  settings!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super('Neuro MindCareDB');

    this.version(1).stores({
      patients: 'id, userId, language, lastActiveAt',
      gameSessions: 'id, gameId, patientId, startedAt, completed, syncStatus',
      reminders: 'id, patientId, type, scheduledTime, isActive',
      reminderEvents: 'id, reminderId, patientId, scheduledAt, status, syncStatus',
      routineItems: 'id, patientId, scheduledTime, order',
      memoryBook: 'id, patientId, createdAt',
      moodEntries: 'id, patientId, recordedAt, syncStatus',
      alerts: 'id, patientId, type, isRead, isResolved, createdAt',
      notes: 'id, patientId, authorId, createdAt',
      cognitiveMetrics: 'id, patientId, date, domain',
      syncQueue: 'id, type, status, createdAt',
      settings: 'key',
    });
  }
}

export const db = new NeuroMindDB();

// Sync Queue helpers
export async function addToSyncQueue(
  type: string,
  payload: Record<string, unknown>,
  deviceId = 'local'
): Promise<void> {
  await db.syncQueue.add({
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: new Date().toISOString(),
    status: 'pending',
    retries: 0,
    deviceId,
  });
}

export async function getPendingSyncEvents(): Promise<SyncEvent[]> {
  return db.syncQueue.where('status').equals('pending').toArray();
}

export async function markSyncEventSynced(id: string): Promise<void> {
  await db.syncQueue.update(id, {
    status: 'synced',
    syncedAt: new Date().toISOString(),
  });
}

export async function markSyncEventFailed(id: string, retries: number): Promise<void> {
  await db.syncQueue.update(id, {
    status: retries >= 5 ? 'failed' : 'pending',
    retries: retries + 1,
  });
}

// Game session helpers
export async function saveGameSession(session: GameSession): Promise<void> {
  await db.gameSessions.put(session);
  await addToSyncQueue('GAME_SESSION_COMPLETED', {
    sessionId: session.id,
    gameId: session.gameId,
    patientId: session.patientId,
    accuracy: session.accuracy,
    score: session.score,
    completed: session.completed,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
  });
}

export async function getPatientGameSessions(
  patientId: string,
  limit = 50
): Promise<GameSession[]> {
  return db.gameSessions
    .where('patientId')
    .equals(patientId)
    .reverse()
    .limit(limit)
    .toArray();
}

// Reminder event helpers
export async function saveMoodEntry(entry: MoodEntry): Promise<void> {
  await db.moodEntries.put(entry);
  await addToSyncQueue('MOOD_ENTRY_SAVED', {
    entryId: entry.id,
    patientId: entry.patientId,
    mood: entry.mood,
    recordedAt: entry.recordedAt,
  });
}

// Settings helpers
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const record = await db.settings.get(key);
  return record ? (record.value as T) : defaultValue;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await db.settings.put({ key, value });
}

export default db;
