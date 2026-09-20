import { api } from './api';
import {
  getPendingSyncEvents,
  markSyncEventSynced,
  markSyncEventFailed,
} from '../lib/db';

type SyncStatus = 'online' | 'offline' | 'syncing' | 'synced' | 'sync-error';

class SyncEngine {
  private isSyncing = false;
  private statusListeners: Array<(status: SyncStatus) => void> = [];
  private isOnline = navigator.onLine;

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('online');
      // Auto-sync when coming back online
      setTimeout(() => this.sync(), 1000);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('offline');
    });
  }

  onStatusChange(listener: (status: SyncStatus) => void): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private emit(status: SyncStatus): void {
    this.statusListeners.forEach((l) => l(status));
  }

  get online(): boolean {
    return this.isOnline;
  }

  async sync(): Promise<void> {
    if (this.isSyncing || !this.isOnline) return;

    try {
      this.isSyncing = true;
      this.emit('syncing');

      const pending = await getPendingSyncEvents();

      if (pending.length === 0) {
        this.emit('synced');
        return;
      }

      let allSuccess = true;

      for (const event of pending) {
        try {
          await api.post('/sync/events', {
            id: event.id,
            type: event.type,
            payload: event.payload,
            createdAt: event.createdAt,
            deviceId: event.deviceId,
          });
          await markSyncEventSynced(event.id);
        } catch {
          await markSyncEventFailed(event.id, event.retries);
          allSuccess = false;
        }
      }

      this.emit(allSuccess ? 'synced' : 'sync-error');
    } catch {
      this.emit('sync-error');
    } finally {
      this.isSyncing = false;
    }
  }

  // Start periodic sync
  startPeriodicSync(intervalMs = 30000): () => void {
    const interval = setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.sync();
      }
    }, intervalMs);
    return () => clearInterval(interval);
  }
}

export const syncEngine = new SyncEngine();
export default syncEngine;
