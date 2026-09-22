// @ts-nocheck
// Match-3 engine: stable tile identities (so falls animate), cascades,
// striped/star specials, objectives and a 12-level campaign.

export type Special = 0 | 1 | 2; // 0 plain, 1 line clear, 2 colour star
export type Cell = { id: number; type: number; special: Special } | null;
export type Board = { rows: number; cols: number; colors: number; cells: Cell[] };

export const idx = (b: Board, r: number, c: number) => r * b.cols + c;
export const rowOf = (b: Board, i: number) => Math.floor(i / b.cols);
export const colOf = (b: Board, i: number) => i % b.cols;

let nextId = 1;
const newCell = (type: number, special: Special = 0): Cell => ({
  id: nextId++,
  type,
  special,
});

export type Objective =
  | { kind: "score"; score: number }
  | { kind: "collect"; need: { type: number; count: number }[]; score?: number };

export type PowerUpType = "bomb" | "extra" | "shuffle" | "double";

export type PowerUp = { type: PowerUpType; uses: number };

export type Level = {
  no: number;
  name: string;
  rows: number;
  cols: number;
  colors: number;
  moves: number;
  objective: Objective;
  stars: [number, number, number];
  powerUps?: PowerUp[];
};

export const CANDIES = [
  { name: "Cherry", color: "#e0451f", glyph: "●" },
  { name: "Ochre", color: "#d99a2b", glyph: "▲" },
  { name: "Pine", color: "#2f6b53", glyph: "■" },
  { name: "Cream", color: "#e7dcc6", glyph: "◆" },
  { name: "Ink", color: "#2a2320", glyph: "★" },
  { name: "Clay", color: "#a8613c", glyph: "⬢" },
  { name: "Sky", color: "#5b7f96", glyph: "✦" },
];

export const LEVELS: Level[] = [
  {
    no: 1,
    name: "First Batch",
    rows: 8,
    cols: 8,
    colors: 5,
    moves: 20,
    objective: { kind: "score", score: 1200 },
    stars: [1200, 2200, 3200],
  },
  {
    no: 2,
    name: "Sugar Run",
    rows: 8,
    cols: 8,
    colors: 5,
    moves: 20,
    objective: { kind: "score", score: 2400 },
    stars: [2400, 3600, 5000],
  },
  {
    no: 3,
    name: "Cherry Order",
    rows: 8,
    cols: 8,
    colors: 5,
    moves: 18,
    objective: { kind: "collect", need: [{ type: 0, count: 14 }] },
    stars: [2000, 3200, 4500],
  },
  {
    no: 4,
    name: "Six Jars",
    rows: 8,
    cols: 8,
    colors: 6,
    moves: 18,
    objective: { kind: "score", score: 3600 },
    stars: [3600, 5200, 7000],
  },
  {
    no: 5,
    name: "Split Order",
    rows: 8,
    cols: 8,
    colors: 6,
    moves: 20,
    objective: {
      kind: "collect",
      need: [
        { type: 1, count: 12 },
        { type: 2, count: 12 },
      ],
    },
    stars: [3000, 4600, 6200],
  },
  {
    no: 6,
    name: "Cascade Shift",
    rows: 8,
    cols: 8,
    colors: 6,
    moves: 18,
    objective: { kind: "score", score: 5200 },
    stars: [5200, 7000, 9000],
  },
  {
    no: 7,
    name: "Pine Crate",
    rows: 9,
    cols: 8,
    colors: 6,
    moves: 16,
    objective: { kind: "collect", need: [{ type: 2, count: 18 }], score: 3000 },
    stars: [3000, 5000, 7000],
  },
  {
    no: 8,
    name: "Night Shift",
    rows: 9,
    cols: 8,
    colors: 6,
    moves: 18,
    objective: { kind: "score", score: 7400 },
    stars: [7400, 9800, 12500],
  },
  {
    no: 9,
    name: "Triple Order",
    rows: 9,
    cols: 8,
    colors: 6,
    moves: 20,
    objective: {
      kind: "collect",
      need: [
        { type: 0, count: 12 },
        { type: 3, count: 12 },
        { type: 4, count: 12 },
      ],
    },
    stars: [4200, 6400, 8600],
  },
  {
    no: 10,
    name: "Seven Sweets",
    rows: 9,
    cols: 9,
    colors: 7,
    moves: 18,
    objective: { kind: "score", score: 9200 },
    stars: [9200, 12000, 15000],
  },
  {
    no: 11,
    name: "Rush Order",
    rows: 9,
    cols: 9,
    colors: 7,
    moves: 16,
    objective: { kind: "collect", need: [{ type: 5, count: 20 }], score: 6000 },
    stars: [6000, 8600, 11500],
  },
  {
    no: 12,
    name: "Master Batch",
    rows: 9,
    cols: 9,
    colors: 7,
    moves: 18,
    objective: { kind: "score", score: 14000 },
    stars: [14000, 18000, 23000],
  },
];

const rnd = (n: number) => Math.floor(Math.random() * n);

function typeAt(b: Board, r: number, c: number): number {
  if (r < 0 || c < 0 || r >= b.rows || c >= b.cols) return -1;
  const cell = b.cells[idx(b, r, c)];
  return cell ? cell.type : -1;
}

/** Fill a fresh board that has no ready-made matches but does have a legal move. */
export function createBoard(level: Level): Board {
  for (let attempt = 0; attempt < 60; attempt++) {
    const b: Board = {
      rows: level.rows,
      cols: level.cols,
      colors: level.colors,
      cells: [],
    };
    b.cells = new Array(level.rows * level.cols).fill(null);
    for (let r = 0; r < b.rows; r++) {
      for (let c = 0; c < b.cols; c++) {
        const banned = new Set<number>();
        if (typeAt(b, r, c - 1) === typeAt(b, r, c - 2) && typeAt(b, r, c - 1) >= 0)
          banned.add(typeAt(b, r, c - 1));
        if (typeAt(b, r - 1, c) === typeAt(b, r - 2, c) && typeAt(b, r - 1, c) >= 0)
          banned.add(typeAt(b, r - 1, c));
        let t = rnd(b.colors);
        let guard = 0;
        while (banned.has(t) && guard++ < 20) t = rnd(b.colors);
        b.cells[idx(b, r, c)] = newCell(t);
      }
    }
    if (findGroups(b).length === 0 && hasMove(b)) return b;
  }
  // extremely unlikely fallback
  const b: Board = {
    rows: level.rows,
    cols: level.cols,
    colors: level.colors,
    cells: [],
  };
  b.cells = new Array(level.rows * level.cols)
    .fill(null)
    .map(() => newCell(rnd(level.colors)));
  return b;
}

export type Group = { cells: number[]; horizontal: boolean; len: number };

/** All runs of 3+ identical candies. */
export function findGroups(b: Board): Group[] {
  const out: Group[] = [];
  for (let r = 0; r < b.rows; r++) {
    let run = 1;
    for (let c = 1; c <= b.cols; c++) {
      const same = c < b.cols && typeAt(b, r, c) >= 0 && typeAt(b, r, c) === typeAt(b, r, c - 1);
      if (same) run++;
      else {
        if (run >= 3) {
          const cells: number[] = [];
          for (let k = c - run; k < c; k++) cells.push(idx(b, r, k));
          out.push({ cells, horizontal: true, len: run });
        }
        run = 1;
      }
    }
  }
  for (let c = 0; c < b.cols; c++) {
    let run = 1;
    for (let r = 1; r <= b.rows; r++) {
      const same = r < b.rows && typeAt(b, r, c) >= 0 && typeAt(b, r, c) === typeAt(b, r - 1, c);
      if (same) run++;
      else {
        if (run >= 3) {
          const cells: number[] = [];
          for (let k = r - run; k < r; k++) cells.push(idx(b, k, c));
          out.push({ cells, horizontal: false, len: run });
        }
        run = 1;
      }
    }
  }
  return out;
}

export const areNeighbours = (b: Board, a: number, z: number) => {
  const dr = Math.abs(rowOf(b, a) - rowOf(b, z));
  const dc = Math.abs(colOf(b, a) - colOf(b, z));
  return dr + dc === 1;
};

export function swapCells(b: Board, a: number, z: number) {
  const t = b.cells[a];
  b.cells[a] = b.cells[z];
  b.cells[z] = t;
}

/** Would swapping these two produce a match (or involve a star)? */
export function isValidSwap(b: Board, a: number, z: number): boolean {
  if (!areNeighbours(b, a, z)) return false;
  const ca = b.cells[a];
  const cz = b.cells[z];
  if (!ca || !cz) return false;
  if (ca.special === 2 || cz.special === 2) return true;
  swapCells(b, a, z);
  const ok = findGroups(b).length > 0;
  swapCells(b, a, z);
  return ok;
}

export function hasMove(b: Board): boolean {
  for (let r = 0; r < b.rows; r++) {
    for (let c = 0; c < b.cols; c++) {
      const i = idx(b, r, c);
      if (c + 1 < b.cols && isValidSwap(b, i, idx(b, r, c + 1))) return true;
      if (r + 1 < b.rows && isValidSwap(b, i, idx(b, r + 1, c))) return true;
    }
  }
  return false;
}

export function shuffleBoard(b: Board) {
  for (let attempt = 0; attempt < 80; attempt++) {
    const types = b.cells.map((c) => (c ? c.type : 0));
    for (let i = types.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      [types[i], types[j]] = [types[j], types[i]];
    }
    b.cells.forEach((c, i) => {
      if (c) c.type = types[i];
    });
    if (findGroups(b).length === 0 && hasMove(b)) return;
  }
}

export type ClearResult = {
  cleared: number[];
  byType: Record<number, number>;
  specials: { index: number; special: Special; type: number }[];
  points: number;
};

/** Expand a set of doomed cells through any specials caught in the blast. */
function expandSpecials(b: Board, doomed: Set<number>) {
  const queue = [...doomed];
  while (queue.length) {
    const i = queue.pop()!;
    const cell = b.cells[i];
    if (!cell || cell.special === 0) continue;
    const r = rowOf(b, i);
    const c = colOf(b, i);
    const add: number[] = [];
    if (cell.special === 1) {
      for (let k = 0; k < b.cols; k++) add.push(idx(b, r, k));
      for (let k = 0; k < b.rows; k++) add.push(idx(b, k, c));
    } else if (cell.special === 2) {
      for (let k = 0; k < b.cells.length; k++) {
        const o = b.cells[k];
        if (o && o.type === cell.type) add.push(k);
      }
    }
    for (const j of add) {
      if (!doomed.has(j) && b.cells[j]) {
        doomed.add(j);
        queue.push(j);
      }
    }
  }
}

/**
 * Resolve one clear pass. Returns null when nothing matches.
 * `swapAnchor` biases where a new special candy is created.
 */
export function clearPass(
  b: Board,
  cascade: number,
  swapAnchor?: number,
  forcedStar?: { index: number; type: number },
  multiplier?: number,
): ClearResult | null {
  const groups = findGroups(b);
  const doomed = new Set<number>();

  if (forcedStar) {
    // a colour star was swapped: wipe every candy of the partner colour
    for (let k = 0; k < b.cells.length; k++) {
      const o = b.cells[k];
      if (o && o.type === forcedStar.type) doomed.add(k);
    }
    doomed.add(forcedStar.index);
  }

  if (!groups.length && !doomed.size) return null;

  const promote: { index: number; special: Special; type: number }[] = [];
  for (const g of groups) {
    for (const i of g.cells) doomed.add(i);
    if (g.len >= 4) {
      const anchor =
        swapAnchor !== undefined && g.cells.includes(swapAnchor)
          ? swapAnchor
          : g.cells[Math.floor(g.cells.length / 2)];
      const cell = b.cells[anchor];
      if (cell) {
        promote.push({ index: anchor, special: g.len >= 5 ? 2 : 1, type: cell.type });
      }
    }
  }

  expandSpecials(b, doomed);

  // promoted cells survive as specials
  for (const p of promote) doomed.delete(p.index);

  const byType: Record<number, number> = {};
  const cleared: number[] = [];
  for (const i of doomed) {
    const cell = b.cells[i];
    if (!cell) continue;
    byType[cell.type] = (byType[cell.type] || 0) + 1;
    cleared.push(i);
    b.cells[i] = null;
  }
  for (const p of promote) {
    const cell = b.cells[p.index];
    if (cell) cell.special = p.special;
  }

        const base = cleared.length * 60;
        const bonus = Math.max(0, cleared.length - 3) * 25;
        const points = Math.round((base + bonus) * (1 + cascade * 0.5) * (multiplier || 1));

  return { cleared, byType, specials: promote, points };
}

/** Drop everything down and refill the gaps from above. */
export function collapse(b: Board): { moved: boolean; spawned: number[] } {
  let moved = false;
  const spawned: number[] = [];
  for (let c = 0; c < b.cols; c++) {
    let write = b.rows - 1;
    for (let r = b.rows - 1; r >= 0; r--) {
      const i = idx(b, r, c);
      const cell = b.cells[i];
      if (cell) {
        const target = idx(b, write, c);
        if (target !== i) {
          b.cells[target] = cell;
          b.cells[i] = null;
          moved = true;
        }
        write--;
      }
    }
    for (let r = write; r >= 0; r--) {
      const i = idx(b, r, c);
      b.cells[i] = newCell(rnd(b.colors));
      spawned.push(i);
      moved = true;
    }
  }
  return { moved, spawned };
}

export function objectiveText(o: Objective): string {
  if (o.kind === "score") return `Reach ${o.score.toLocaleString()} points`;
  const parts = o.need.map((n) => `${n.count} ${CANDIES[n.type].name}`);
  return `Collect ${parts.join(" · ")}`;
}

export function objectiveMet(
  o: Objective,
  score: number,
  collected: Record<number, number>,
): boolean {
  if (o.kind === "score") return score >= o.score;
  const all = o.need.every((n) => (collected[n.type] || 0) >= n.count);
  return all && (!o.score || score >= o.score);
}

export type AppliedPowerUp = PowerUpType;

export function applyPowerUp(
  b: Board,
  pw: PowerUp,
  at?: number,
): { cleared?: number[]; bonusMoves?: number; shuffled?: boolean; multiplier?: number } {
  const out: { cleared?: number[]; bonusMoves?: number; shuffled?: boolean; multiplier?: number } = {};
  if (pw.uses <= 0) return out;

  if (pw.type === "bomb") {
    const cx = at !== undefined ? colOf(b, at) : Math.floor(b.cols / 2);
    const cy = at !== undefined ? rowOf(b, at) : Math.floor(b.rows / 2);
    const cleared: number[] = [];
    for (let r = Math.max(0, cy - 1); r <= Math.min(b.rows - 1, cy + 1); r++) {
      for (let c = Math.max(0, cx - 1); c <= Math.min(b.cols - 1, cx + 1); c++) {
        const i = idx(b, r, c);
        if (b.cells[i]) {
          cleared.push(i);
          b.cells[i] = null;
        }
      }
    }
    out.cleared = cleared;
  }
  if (pw.type === "extra") {
    out.bonusMoves = 5;
  }
  if (pw.type === "shuffle") {
    shuffleBoard(b);
    out.shuffled = true;
  }
  if (pw.type === "double") {
    out.multiplier = 2;
  }
  return out;
}

export function starsFor(level: Level, score: number): number {
  const [a, b2, c] = level.stars;
  if (score >= c) return 3;
  if (score >= b2) return 2;
  if (score >= a) return 1;
  return 0;
}

/* ---------------- progress storage ---------------- */

const KEY = "diecut.match3.v1";
export type Match3Progress = { stars: Record<number, number>; best: Record<number, number> };

export function loadProgress(): Match3Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { stars: {}, best: {} };
    const p = JSON.parse(raw) as Match3Progress;
    return { stars: p.stars || {}, best: p.best || {} };
  } catch {
    return { stars: {}, best: {} };
  }
}

export function saveProgress(p: Match3Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function unlockedCount(p: Match3Progress): number {
  let n = 1;
  for (const lv of LEVELS) {
    if ((p.stars[lv.no] || 0) > 0) n = Math.max(n, lv.no + 1);
  }
  return Math.min(LEVELS.length, n);
}
