// @ts-nocheck
// Real die-cut jigsaw geometry: every shared edge is generated once (so the two
// neighbours that meet along it interlock exactly), then stroked into a CSS path().

export type Seg = { t: "L" | "C"; p: number[] };
export type Edge = { segs: Seg[]; sign: number };

export type PuzzlePiece = {
  id: number;
  r: number;
  c: number;
  /** bounding box of the piece (tabs included), in sheet coordinates */
  x: number;
  y: number;
  w: number;
  h: number;
  /** CSS path() in the piece's own box-local coordinates */
  d: string;
};

export type Puzzle = {
  cols: number;
  rows: number;
  BW: number;
  BH: number;
  cw: number;
  ch: number;
  snapR: number;
  pieces: PuzzlePiece[];
};

export function makeRng(seed: number): () => number {
  let s = (Math.floor(seed * 2654435761) >>> 0) || 0x9e3779b9;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

const r2 = (v: number) => Math.round(v * 100) / 100;

/** One canonical edge running (0,0) -> (1,0); the tab bulges toward +y. */
function makeEdge(rng: () => number): Edge {
  const ys = 0.88 + rng() * 0.26;
  const xs = 0.92 + rng() * 0.16;
  const X = (x: number) => r2(0.5 + (x - 0.5) * xs);
  const Y = (y: number) => r2(y * ys);
  const segs: Seg[] = [
    { t: "L", p: [X(0.37), 0] },
    { t: "C", p: [X(0.43), 0, X(0.42), Y(0.045), X(0.46), Y(0.09)] },
    { t: "C", p: [X(0.455), Y(0.115), X(0.42), Y(0.115), X(0.42), Y(0.15)] },
    { t: "C", p: [X(0.405), Y(0.175), X(0.415), Y(0.19), X(0.445), Y(0.19)] },
    { t: "C", p: [X(0.475), Y(0.205), X(0.525), Y(0.205), X(0.555), Y(0.19)] },
    { t: "C", p: [X(0.585), Y(0.19), X(0.595), Y(0.175), X(0.58), Y(0.15)] },
    { t: "C", p: [X(0.58), Y(0.115), X(0.545), Y(0.115), X(0.54), Y(0.09)] },
    { t: "C", p: [X(0.58), Y(0.045), X(0.57), 0, X(0.63), 0] },
    { t: "L", p: [1, 0] },
  ];
  return { segs, sign: rng() < 0.5 ? -1 : 1 };
}

function endOf(sg: Seg): [number, number] {
  const p = sg.p;
  return [p[p.length - 2], p[p.length - 1]];
}

/** Walk the same edge backwards (needed when a piece traverses it the other way). */
function reverse(segs: Seg[]): Seg[] {
  const ends: [number, number][] = [];
  for (const sg of segs) ends.push(endOf(sg));
  const out: Seg[] = [];
  for (let i = segs.length - 1; i >= 0; i--) {
    const sg = segs[i];
    const prev: [number, number] = i === 0 ? [0, 0] : ends[i - 1];
    if (sg.t === "L") out.push({ t: "L", p: [prev[0], prev[1]] });
    else out.push({ t: "C", p: [sg.p[2], sg.p[3], sg.p[0], sg.p[1], prev[0], prev[1]] });
  }
  return out;
}

type Ctx = { ox: number; oy: number; len: number; axis: "h" | "v"; sign: number };

function pt(x: number, y: number, ctx: Ctx): [number, number] {
  if (ctx.axis === "h") return [r2(ctx.ox + x * ctx.len), r2(ctx.oy + ctx.sign * y * ctx.len)];
  return [r2(ctx.ox + ctx.sign * y * ctx.len), r2(ctx.oy + x * ctx.len)];
}

function segStr(sg: Seg, ctx: Ctx): string {
  if (sg.t === "L") {
    const a = pt(sg.p[0], sg.p[1], ctx);
    return `L${a[0]} ${a[1]}`;
  }
  const a = pt(sg.p[0], sg.p[1], ctx);
  const b = pt(sg.p[2], sg.p[3], ctx);
  const c = pt(sg.p[4], sg.p[5], ctx);
  return `C${a[0]} ${a[1]} ${b[0]} ${b[1]} ${c[0]} ${c[1]}`;
}

const edgeStr = (segs: Seg[], ctx: Ctx) => segs.map((s) => segStr(s, ctx)).join(" ");

export function buildPuzzle(
  cols: number,
  rows: number,
  BW: number,
  BH: number,
  rng: () => number,
): Puzzle {
  const cw = BW / cols;
  const ch = BH / rows;
  const T = Math.max(cw, ch) * 0.26 + 6;

  const hE: (Edge | null)[][] = [];
  const vE: (Edge | null)[][] = [];
  for (let r = 0; r <= rows; r++) {
    hE.push([]);
    for (let c = 0; c < cols; c++) hE[r].push(r === 0 || r === rows ? null : makeEdge(rng));
  }
  for (let r = 0; r < rows; r++) {
    vE.push([]);
    for (let c = 0; c <= cols; c++) vE[r].push(c === 0 || c === cols ? null : makeEdge(rng));
  }

  const pieces: PuzzlePiece[] = [];
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw - T;
      const y = r * ch - T;
      const TLx = T;
      const TLy = T;
      let d = `M${r2(TLx)} ${r2(TLy)}`;

      if (r > 0 && hE[r][c]) {
        const e = hE[r][c]!;
        d += " " + edgeStr(e.segs, { ox: T, oy: T, len: cw, axis: "h", sign: e.sign });
      } else {
        d += ` L${r2(T + cw)} ${r2(T)}`;
      }

      if (c < cols - 1 && vE[r][c + 1]) {
        const e = vE[r][c + 1]!;
        d += " " + edgeStr(e.segs, { ox: T + cw, oy: T, len: ch, axis: "v", sign: e.sign });
      } else {
        d += ` L${r2(T + cw)} ${r2(T + ch)}`;
      }

      if (r < rows - 1 && hE[r + 1][c]) {
        const e = hE[r + 1][c]!;
        d += " " + edgeStr(reverse(e.segs), { ox: T, oy: T + ch, len: cw, axis: "h", sign: e.sign });
      } else {
        d += ` L${r2(T)} ${r2(T + ch)}`;
      }

      if (c > 0 && vE[r][c]) {
        const e = vE[r][c]!;
        d += " " + edgeStr(reverse(e.segs), { ox: T, oy: T, len: ch, axis: "v", sign: e.sign });
      } else {
        d += ` L${r2(T)} ${r2(T)}`;
      }

      d += " Z";
      pieces.push({ id: id++, r, c, x, y, w: cw + 2 * T, h: ch + 2 * T, d });
    }
  }

  return { cols, rows, BW, BH, cw, ch, snapR: Math.max(22, Math.min(cw, ch) * 0.3), pieces };
}

export type Rect = { x: number; y: number; w: number; h: number };

/**
 * Deal the loose pieces onto the felt around the sheet — never on top of it.
 * Returns centres in sheet-local coordinates (children of the sheet layer).
 */
export function scatterPieces(
  pieces: PuzzlePiece[],
  board: Rect,
  felt: { w: number; h: number },
  rng: () => number,
): { dx: number; dy: number }[] {
  const pad = 10;
  const rects: Rect[] = [];
  const topH = board.y - pad;
  if (topH > 42) rects.push({ x: 0, y: 4, w: felt.w, h: topH - 6 });
  const botY = board.y + board.h + pad;
  if (felt.h - botY > 52) rects.push({ x: 0, y: botY, w: felt.w, h: felt.h - botY - 6 });
  const leftW = board.x - pad;
  if (leftW > 62) rects.push({ x: 4, y: board.y, w: leftW - 8, h: board.h });
  const rightX = board.x + board.w + pad;
  if (felt.w - rightX > 62) rects.push({ x: rightX, y: board.y, w: felt.w - rightX - 4, h: board.h });
  if (!rects.length) {
    rects.push({ x: 6, y: botY, w: felt.w - 12, h: Math.max(46, felt.h - botY - 6) });
  }
  const areas = rects.map((r) => Math.max(1, r.w * r.h));
  const total = areas.reduce((a, b) => a + b, 0);

  const order = pieces.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const out: { dx: number; dy: number }[] = [];
  const placed: { x: number; y: number }[] = [];

  // everything below happens in FELT coordinates; conversion to sheet-local
  // happens exactly once, at the end.
  for (const idx of order) {
    const p = pieces[idx];
    const hw = p.w / 2;
    const hh = p.h / 2;
    let best: { x: number; y: number; score: number } | null = null;

    for (let t = 0; t < 18; t++) {
      let pick = rng() * total;
      let ri = 0;
      for (; ri < rects.length - 1; ri++) {
        pick -= areas[ri];
        if (pick <= 0) break;
      }
      const rect = rects[ri];
      let cx = rect.x + rect.w * (0.12 + rng() * 0.76);
      let cy = rect.y + rect.h * (0.12 + rng() * 0.76);

      // whole bounding box stays on the table
      if (hw * 2 < felt.w) cx = Math.min(Math.max(cx, hw + 2), felt.w - hw - 2);
      if (hh * 2 < felt.h) cy = Math.min(Math.max(cy, hh + 2), felt.h - hh - 2);

      // …and never on top of the sheet itself
      const inX = cx > board.x - hw * 0.5 && cx < board.x + board.w + hw * 0.5;
      const inY = cy > board.y - hh * 0.5 && cy < board.y + board.h + hh * 0.5;
      if (inX && inY) {
        const dl = cx - (board.x - hw - 6);
        const dr = board.x + board.w + hw + 6 - cx;
        const dt = cy - (board.y - hh - 6);
        const db = board.y + board.h + hh + 6 - cy;
        const m = Math.min(dl, dr, dt, db);
        if (m === dl) cx = board.x - hw - 6;
        else if (m === dr) cx = board.x + board.w + hw + 6;
        else if (m === dt) cy = board.y - hh - 6;
        else cy = board.y + board.h + hh + 6;
        if (hw * 2 < felt.w) cx = Math.min(Math.max(cx, hw + 2), felt.w - hw - 2);
        if (hh * 2 < felt.h) cy = Math.min(Math.max(cy, hh + 2), felt.h - hh - 2);
      }

      let score = Infinity;
      for (const q of placed) {
        score = Math.min(score, Math.hypot(q.x - cx, q.y - cy));
      }
      if (!best || score > best.score) best = { x: cx, y: cy, score };
      if (score > (p.w + p.h) * 0.32) break;
    }

    const b = best ?? { x: board.x, y: board.y + board.h + 30, score: 0 };
    placed.push({ x: b.x, y: b.y });
    // felt -> sheet-local centre -> translate offset from home
    const sx = b.x - board.x;
    const sy = b.y - board.y;
    out[idx] = { dx: sx - (p.x + p.w / 2), dy: sy - (p.y + p.h / 2) };
  }

  return out;
}
