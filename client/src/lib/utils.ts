import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale = 'en-IN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: string | Date, locale = 'en-IN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function rollingMedian(arr: number[], window = 7): number {
  if (arr.length === 0) return 0;
  const slice = arr.slice(-window).sort((a, b) => a - b);
  const mid = Math.floor(slice.length / 2);
  return slice.length % 2 !== 0
    ? slice[mid]
    : (slice[mid - 1] + slice[mid]) / 2;
}

export function percentageChange(current: number, baseline: number): number {
  if (baseline === 0) return 0;
  return ((current - baseline) / baseline) * 100;
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy)}%`;
}

export function formatResponseTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function getDomainColor(domain: string): string {
  const colors: Record<string, string> = {
    memory: '#3b82f6',
    attention: '#8b5cf6',
    'executive-function': '#f59e0b',
    recognition: '#10b981',
    'routine-recall': '#ec4899',
    'pattern-reasoning': '#f97316',
    'emotional-engagement': '#ef4444',
  };
  return colors[domain] ?? '#6b7280';
}

export function getDomainLabel(domain: string): string {
  const labels: Record<string, string> = {
    memory: 'Memory Activity',
    attention: 'Attention Activity',
    'executive-function': 'Planning Activity',
    recognition: 'Recognition Activity',
    'routine-recall': 'Routine Activity',
    'pattern-reasoning': 'Pattern Activity',
    'emotional-engagement': 'Engagement Activity',
  };
  return labels[domain] ?? domain;
}

export function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    sad: '😔',
    worried: '😟',
  };
  return emojis[mood] ?? '😐';
}

export function getReminderIcon(type: string): string {
  const icons: Record<string, string> = {
    medicine: '💊',
    hydration: '💧',
    activity: '🚶',
    appointment: '📅',
    meal: '🍽',
    sleep: '🛏',
    exercise: '🧘',
    social: '👥',
  };
  return icons[type] ?? '🔔';
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function isToday(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}
