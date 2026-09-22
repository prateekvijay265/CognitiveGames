import { useEffect, useRef } from 'react';
import { useAppDataStore } from '../store/appDataStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const NOTIFIED_KEY = 'Neuro Mind_notified_reminders';

export function useReminderEngine() {
  const { user } = useAuthStore();
  const { reminders } = useAppDataStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Request Notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Create a generic chime audio element if we want sounds
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // short friendly chime
    }
  }, []);

  useEffect(() => {
    // Only run this engine for patients
    if (!user || user.role !== 'patient' || !reminders || reminders.length === 0) return;

    const checkReminders = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

      // Load already notified from localStorage to prevent spamming
      const notifiedData = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '{}');
      let updated = false;

      reminders.forEach((reminder) => {
        if (reminder.scheduledTime === currentTimeStr) {
          const uniqueKey = `${reminder.id}-${todayStr}`;
          
          if (!notifiedData[uniqueKey]) {
            // Trigger Notification!
            fireNotification(reminder);
            
            // Mark as notified
            notifiedData[uniqueKey] = true;
            updated = true;
          }
        }
      });

      if (updated) {
        localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notifiedData));
      }
    };

    const fireNotification = (reminder: any) => {
      // 1. In-App Toast
      toast(reminder.title, {
        description: reminder.description || `It's time for ${reminder.title}`,
        duration: 10000,
        action: {
          label: 'View',
          onClick: () => window.location.href = '/patient/reminders'
        }
      });

      // 2. OS Native Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Neuro Mind: ' + reminder.title, {
          body: reminder.description || `It's time for ${reminder.title}`,
          icon: '/pwa-192x192.png',
          // @ts-ignore - 'vibrate' works in Android Chrome but isn't always in the standard TS DOM types
          vibrate: reminder.vibrationEnabled ? [200, 100, 200, 100, 200] : undefined,
        });
      }

      // 3. Sound
      if (reminder.soundEnabled && audioRef.current) {
        audioRef.current.play().catch((e) => console.log('Audio play prevented by browser:', e));
      }

      // 4. Voice (Text-to-Speech)
      if (reminder.voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Reminder. ${reminder.title}. ${reminder.description || ''}`);
        window.speechSynthesis.speak(utterance);
      }
    };

    // Check immediately, then every 30 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 30 * 1000);

    return () => clearInterval(interval);
  }, [user, reminders]);
}

