// @ts-nocheck
export type ScoreEntry = {
  initials: string;
  score: number;
  round: number;
  date: number;
};

const KEY = "diecut.ledger.v1";
export const MAX_ENTRIES = 8;

export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScoreEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => typeof e?.score === "number")
      .map((e) => ({
        initials: String(e.initials ?? "---").slice(0, 3).toUpperCase(),
        score: Math.max(0, Math.round(e.score)),
        round: Math.max(1, Math.round(e.round || 1)),
        date: e.date || Date.now(),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function qualifies(list: ScoreEntry[], score: number): boolean {
  if (score <= 0) return false;
  if (list.length < MAX_ENTRIES) return true;
  return score > list[list.length - 1].score;
}

export function insertScore(list: ScoreEntry[], entry: ScoreEntry): ScoreEntry[] {
  const next = [...list, entry].sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — ledger stays in memory */
  }
  return next;
}

export function bestScore(list: ScoreEntry[]): number {
  return list.length ? list[0].score : 0;
}
