// @ts-nocheck
// Complete chess rules + a small alpha-beta engine.
// Board is a 64-length array, index 0 = a8 ... 63 = h1.
// Pieces: uppercase = white (PNBRQK), lowercase = black, "" = empty.

export type Color = "w" | "b";
export type Move = {
  from: number;
  to: number;
  promo?: string;
  castle?: "K" | "Q";
  ep?: boolean;
  captured?: string;
};

export type State = {
  board: string[];
  turn: Color;
  castling: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };
  ep: number | null;
  half: number;
  full: number;
};

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const colorOf = (p: string): Color | null =>
  p === "" ? null : p === p.toUpperCase() ? "w" : "b";

export const rank = (i: number) => Math.floor(i / 8);
export const file = (i: number) => i % 8;
export const square = (i: number) => "abcdefgh"[file(i)] + (8 - rank(i));

export function parseFen(fen: string): State {
  const [pos, turn, castle, ep] = fen.split(" ");
  const board: string[] = new Array(64).fill("");
  let i = 0;
  for (const ch of pos) {
    if (ch === "/") continue;
    if (/\d/.test(ch)) i += parseInt(ch, 10);
    else board[i++] = ch;
  }
  return {
    board,
    turn: turn === "b" ? "b" : "w",
    castling: {
      wK: castle.includes("K"),
      wQ: castle.includes("Q"),
      bK: castle.includes("k"),
      bQ: castle.includes("q"),
    },
    ep: ep && ep !== "-" ? "abcdefgh".indexOf(ep[0]) + (8 - parseInt(ep[1], 10)) * 8 : null,
    half: 0,
    full: 1,
  };
}

export const initialState = () => parseFen(START_FEN);

export const cloneState = (s: State): State => ({
  board: s.board.slice(),
  turn: s.turn,
  castling: { ...s.castling },
  ep: s.ep,
  half: s.half,
  full: s.full,
});

const N = -8;
const S = 8;
const E = 1;
const W = -1;

const slide = (piece: string): number[] => {
  const p = piece.toLowerCase();
  if (p === "b") return [N + E, N + W, S + E, S + W];
  if (p === "r") return [N, S, E, W];
  return [N, S, E, W, N + E, N + W, S + E, S + W];
};

const KNIGHT: number[] = [-17, -15, -10, -6, 6, 10, 15, 17];
const KING: number[] = [-9, -8, -7, -1, 1, 7, 8, 9];

const onBoard = (i: number) => i >= 0 && i < 64;
/** reject moves that wrapped around the board edge */
const stepOk = (from: number, to: number, maxFileDelta = 2) =>
  onBoard(to) && Math.abs(file(from) - file(to)) <= maxFileDelta;

/** Is `sq` attacked by `by`? */
export function isAttacked(board: string[], sq: number, by: Color): boolean {
  // pawns
  const dir = by === "w" ? 1 : -1; // attacker sits "below" for white
  for (const d of [-1, 1]) {
    const from = sq + dir * 8 + d;
    if (onBoard(from) && Math.abs(file(from) - file(sq)) === 1) {
      const p = board[from];
      if (p && colorOf(p) === by && p.toLowerCase() === "p") return true;
    }
  }
  // knights
  for (const d of KNIGHT) {
    const from = sq + d;
    if (!onBoard(from)) continue;
    if (Math.abs(file(from) - file(sq)) > 2) continue;
    const p = board[from];
    if (p && colorOf(p) === by && p.toLowerCase() === "n") return true;
  }
  // king
  for (const d of KING) {
    const from = sq + d;
    if (!onBoard(from)) continue;
    if (Math.abs(file(from) - file(sq)) > 1) continue;
    const p = board[from];
    if (p && colorOf(p) === by && p.toLowerCase() === "k") return true;
  }
  // sliders
  const rays: [number[], string[]][] = [
    [[N, S, E, W], ["r", "q"]],
    [
      [N + E, N + W, S + E, S + W],
      ["b", "q"],
    ],
  ];
  for (const [dirs, kinds] of rays) {
    for (const d of dirs) {
      let cur = sq;
      for (;;) {
        const next = cur + d;
        if (!onBoard(next)) break;
        if (Math.abs(file(next) - file(cur)) > 1) break;
        const p = board[next];
        if (p) {
          if (colorOf(p) === by && kinds.includes(p.toLowerCase())) return true;
          break;
        }
        cur = next;
      }
    }
  }
  return false;
}

export function kingSquare(board: string[], c: Color): number {
  const k = c === "w" ? "K" : "k";
  return board.indexOf(k);
}

export function inCheck(s: State, c: Color = s.turn): boolean {
  const k = kingSquare(s.board, c);
  if (k < 0) return false;
  return isAttacked(s.board, k, c === "w" ? "b" : "w");
}

function pseudoMoves(s: State, color: Color): Move[] {
  const out: Move[] = [];
  const { board } = s;

  for (let i = 0; i < 64; i++) {
    const p = board[i];
    if (!p || colorOf(p) !== color) continue;
    const kind = p.toLowerCase();

    if (kind === "p") {
      const dir = color === "w" ? -8 : 8;
      const startRank = color === "w" ? 6 : 1;
      const lastRank = color === "w" ? 0 : 7;
      const one = i + dir;
      if (onBoard(one) && !board[one]) {
        if (rank(one) === lastRank) {
          for (const q of ["q", "r", "b", "n"]) out.push({ from: i, to: one, promo: q });
        } else {
          out.push({ from: i, to: one });
          const two = i + dir * 2;
          if (rank(i) === startRank && !board[two]) out.push({ from: i, to: two });
        }
      }
      for (const d of [-1, 1]) {
        const cap = i + dir + d;
        if (!onBoard(cap) || Math.abs(file(cap) - file(i)) !== 1) continue;
        const t = board[cap];
        if (t && colorOf(t) !== color) {
          if (rank(cap) === lastRank) {
            for (const q of ["q", "r", "b", "n"])
              out.push({ from: i, to: cap, promo: q, captured: t });
          } else out.push({ from: i, to: cap, captured: t });
        } else if (!t && s.ep === cap) {
          out.push({ from: i, to: cap, ep: true, captured: color === "w" ? "p" : "P" });
        }
      }
      continue;
    }

    if (kind === "n" || kind === "k") {
      const steps = kind === "n" ? KNIGHT : KING;
      const maxDelta = kind === "n" ? 2 : 1;
      for (const d of steps) {
        const to = i + d;
        if (!stepOk(i, to, maxDelta)) continue;
        const t = board[to];
        if (t && colorOf(t) === color) continue;
        out.push({ from: i, to, captured: t || undefined });
      }
      continue;
    }

    for (const d of slide(kind)) {
      let cur = i;
      for (;;) {
        const to = cur + d;
        if (!onBoard(to)) break;
        if (Math.abs(file(to) - file(cur)) > 1) break;
        const t = board[to];
        if (t) {
          if (colorOf(t) !== color) out.push({ from: i, to, captured: t });
          break;
        }
        out.push({ from: i, to });
        cur = to;
      }
    }
  }

  // castling
  const home = color === "w" ? 60 : 4;
  const rights = color === "w" ? [s.castling.wK, s.castling.wQ] : [s.castling.bK, s.castling.bQ];
  const enemy: Color = color === "w" ? "b" : "w";
  if (board[home]?.toLowerCase() === "k" && !isAttacked(board, home, enemy)) {
    if (rights[0] && !board[home + 1] && !board[home + 2]) {
      if (!isAttacked(board, home + 1, enemy) && !isAttacked(board, home + 2, enemy))
        out.push({ from: home, to: home + 2, castle: "K" });
    }
    if (rights[1] && !board[home - 1] && !board[home - 2] && !board[home - 3]) {
      if (!isAttacked(board, home - 1, enemy) && !isAttacked(board, home - 2, enemy))
        out.push({ from: home, to: home - 2, castle: "Q" });
    }
  }

  return out;
}

export function makeMove(s: State, m: Move): State {
  const n = cloneState(s);
  const b = n.board;
  const piece = b[m.from];
  const color = colorOf(piece)!;
  const kind = piece.toLowerCase();

  n.ep = null;
  n.half = kind === "p" || m.captured ? 0 : n.half + 1;

  b[m.to] = m.promo ? (color === "w" ? m.promo.toUpperCase() : m.promo) : piece;
  b[m.from] = "";

  if (m.ep) {
    const capSq = m.to + (color === "w" ? 8 : -8);
    b[capSq] = "";
  }
  if (kind === "p" && Math.abs(m.to - m.from) === 16) {
    n.ep = (m.from + m.to) / 2;
  }
  if (m.castle) {
    const homeRank = color === "w" ? 56 : 0;
    if (m.castle === "K") {
      b[homeRank + 5] = b[homeRank + 7];
      b[homeRank + 7] = "";
    } else {
      b[homeRank + 3] = b[homeRank + 0];
      b[homeRank + 0] = "";
    }
  }

  // castling rights
  if (kind === "k") {
    if (color === "w") {
      n.castling.wK = false;
      n.castling.wQ = false;
    } else {
      n.castling.bK = false;
      n.castling.bQ = false;
    }
  }
  const touch = (sq: number) => {
    if (sq === 63) n.castling.wK = false;
    if (sq === 56) n.castling.wQ = false;
    if (sq === 7) n.castling.bK = false;
    if (sq === 0) n.castling.bQ = false;
  };
  touch(m.from);
  touch(m.to);

  n.turn = color === "w" ? "b" : "w";
  if (color === "b") n.full++;
  return n;
}

export function legalMoves(s: State, color: Color = s.turn): Move[] {
  return pseudoMoves(s, color).filter((m) => {
    const n = makeMove(s, m);
    return !inCheck(n, color);
  });
}

export function movesFrom(s: State, from: number): Move[] {
  return legalMoves(s).filter((m) => m.from === from);
}

export type Outcome =
  | { over: false }
  | { over: true; result: "checkmate" | "stalemate" | "fifty" | "material"; winner?: Color };

export function outcome(s: State): Outcome {
  const moves = legalMoves(s);
  if (moves.length === 0) {
    if (inCheck(s)) {
      return { over: true, result: "checkmate", winner: s.turn === "w" ? "b" : "w" };
    }
    return { over: true, result: "stalemate" };
  }
  if (s.half >= 100) return { over: true, result: "fifty" };
  const pieces = s.board.filter(Boolean).map((p) => p.toLowerCase());
  const heavy = pieces.filter((p) => p !== "k");
  if (heavy.length === 0 || (heavy.length === 1 && (heavy[0] === "n" || heavy[0] === "b"))) {
    return { over: true, result: "material" };
  }
  return { over: false };
}

/* ---------------- notation ---------------- */

export function toSan(s: State, m: Move): string {
  const piece = s.board[m.from];
  const kind = piece.toLowerCase();
  if (m.castle) return m.castle === "K" ? "O-O" : "O-O-O";

  let san = "";
  if (kind !== "p") san += piece.toUpperCase();
  else if (m.captured) san += "abcdefgh"[file(m.from)];

  if (kind !== "p") {
    const rivals = legalMoves(s).filter(
      (o) =>
        o.to === m.to &&
        o.from !== m.from &&
        s.board[o.from]?.toLowerCase() === kind,
    );
    if (rivals.length) {
      const sameFile = rivals.some((o) => file(o.from) === file(m.from));
      const sameRank = rivals.some((o) => rank(o.from) === rank(m.from));
      if (!sameFile) san += "abcdefgh"[file(m.from)];
      else if (!sameRank) san += String(8 - rank(m.from));
      else san += square(m.from);
    }
  }

  if (m.captured) san += "x";
  san += square(m.to);
  if (m.promo) san += "=" + m.promo.toUpperCase();

  const after = makeMove(s, m);
  if (inCheck(after)) {
    san += legalMoves(after).length === 0 ? "#" : "+";
  }
  return san;
}

/* ---------------- engine ---------------- */

const VALUE: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// piece-square tables from white's point of view (index 0 = a8)
const PST: Record<string, number[]> = {
  p: [
    0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5,
    10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20,
    -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  n: [
    -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10,
    0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10,
    5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50,
  ],
  b: [
    -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0,
    -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10,
    -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10, -10, -10, -10, -10, -10, -20,
  ],
  r: [
    0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0,
    0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0,
    5, 5, 0, 0, 0,
  ],
  q: [
    -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10,
    -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0,
    0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20,
  ],
  k: [
    -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40,
    -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30,
    -30, -20, -10, -20, -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0,
    10, 30, 20,
  ],
};

const mirror = (i: number) => (7 - rank(i)) * 8 + file(i);

export function evaluate(s: State): number {
  let score = 0;
  for (let i = 0; i < 64; i++) {
    const p = s.board[i];
    if (!p) continue;
    const kind = p.toLowerCase();
    const c = colorOf(p)!;
    const v = VALUE[kind] + (PST[kind]?.[c === "w" ? i : mirror(i)] ?? 0);
    score += c === "w" ? v : -v;
  }
  return s.turn === "w" ? score : -score;
}

function orderMoves(s: State, moves: Move[]): Move[] {
  return moves
    .map((m) => {
      let s2 = 0;
      if (m.captured) s2 += 10 * VALUE[m.captured.toLowerCase()] - VALUE[s.board[m.from].toLowerCase()];
      if (m.promo) s2 += 800;
      return { m, s2 };
    })
    .sort((a, b) => b.s2 - a.s2)
    .map((x) => x.m);
}

function negamax(s: State, depth: number, alpha: number, beta: number): number {
  if (depth === 0) return evaluate(s);
  const moves = legalMoves(s);
  if (!moves.length) return inCheck(s) ? -100000 + (4 - depth) : 0;

  let best = -Infinity;
  for (const m of orderMoves(s, moves)) {
    const v = -negamax(makeMove(s, m), depth - 1, -beta, -alpha);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

export type Difficulty = "easy" | "medium" | "hard";

export function bestMove(s: State, difficulty: Difficulty): Move | null {
  const moves = legalMoves(s);
  if (!moves.length) return null;

  if (difficulty === "easy") {
    // mostly greedy on captures, with a random streak so it stays beatable
    if (Math.random() < 0.45) return moves[Math.floor(Math.random() * moves.length)];
  }
  // plies searched *after* the root move — 2 keeps "master" snappy on mobile
  const depth = difficulty === "easy" ? 0 : difficulty === "medium" ? 1 : 2;

  let best: Move[] = [];
  let bestScore = -Infinity;
  for (const m of orderMoves(s, moves)) {
    const v = -negamax(makeMove(s, m), depth, -Infinity, Infinity);
    if (v > bestScore + 1) {
      bestScore = v;
      best = [m];
    } else if (Math.abs(v - bestScore) <= 1) {
      best.push(m);
    }
  }
  return best[Math.floor(Math.random() * best.length)] ?? moves[0];
}

/* ---------------- record storage ---------------- */

const KEY = "diecut.chess.v1";
export type ChessRecord = { w: number; l: number; d: number };

export function loadRecord(): ChessRecord {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { w: 0, l: 0, d: 0 };
    const r = JSON.parse(raw) as ChessRecord;
    return { w: r.w || 0, l: r.l || 0, d: r.d || 0 };
  } catch {
    return { w: 0, l: 0, d: 0 };
  }
}

export function saveRecord(r: ChessRecord) {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    /* ignore */
  }
}
