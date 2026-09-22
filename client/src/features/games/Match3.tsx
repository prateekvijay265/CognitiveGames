// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as RPointerEvent } from "react";
import {
  CANDIES,
  LEVELS,
  clearPass,
  collapse,
  colOf,
  createBoard,
  hasMove,
  idx,
  isValidSwap,
  loadProgress,
  objectiveMet,
  objectiveText,
  rowOf,
  saveProgress,
  shuffleBoard,
  starsFor,
  swapCells,
  unlockedCount,
} from "../../lib/match3";
import type { Board, Level, Match3Progress, PowerUp } from "../../lib/match3";
import { applyPowerUp } from "../../lib/match3";
import { Fx } from "./Fx";
import type { FxHandle } from "./Fx";
import * as sfx from "../../lib/audio";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex shrink-0 gap-0.5" aria-label={`${n} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.6l2.5 5.3 5.7.8-4.1 4 1 5.7L10 14.7 4.9 17.4l1-5.7-4.1-4 5.7-.8z"
            fill={i < n ? "var(--color-ochre)" : "transparent"}
            stroke="var(--color-ink)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Level select                                                        */
/* ------------------------------------------------------------------ */

function LevelMap({
  progress,
  onPlay,
  onExit,
}: {
  progress: Match3Progress;
  onPlay: (lv: Level) => void;
  onExit: () => void;
}) {
  const unlocked = unlockedCount(progress);
  const total = LEVELS.reduce((a, l) => a + (progress.stars[l.no] || 0), 0);

  return (
    <div className="paper h-[100dvh] w-full overflow-y-auto">
      <div className="grain mx-auto min-h-full max-w-[1000px] px-4 pb-14 sm:px-6">
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink py-3">
          <button className="btn btn-ghost !px-3 !py-1.5 text-[0.68rem]" onClick={onExit}>
            ← Arcade
          </button>
          <span className="smallcaps text-sand">
            {total} / {LEVELS.length * 3} stars
          </span>
        </div>

        <div className="pt-7">
          <p className="smallcaps text-vermilion">Sweet shop · match three</p>
          <h1 className="mt-1 font-display text-[clamp(2.6rem,9vw,4.6rem)] font-black leading-[0.85] tracking-[-0.03em]">
            SUGAR
            <br />
            PRESS
          </h1>
          <p className="mt-3 max-w-[48ch] text-ink/80">
            Swap two neighbours to line up three. Four in a row presses a <b>line candy</b>, five
            presses a <b>colour star</b>. Fill the order before the moves run out.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {LEVELS.map((lv) => {
            const locked = lv.no > unlocked;
            const stars = progress.stars[lv.no] || 0;
            const best = progress.best[lv.no] || 0;
            return (
              <button
                key={lv.no}
                type="button"
                disabled={locked}
                onClick={() => onPlay(lv)}
                className={`group border-2 p-3 text-left transition ${
                  locked
                    ? "cursor-not-allowed border-ink/25 bg-kraft2/30 opacity-55"
                    : "border-ink bg-kraft/70 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-2xl font-semibold leading-none">
                    {String(lv.no).padStart(2, "0")}
                  </span>
                  {locked ? (
                    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
                      <path
                        d="M3 7V4.5a4 4 0 118 0V7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <rect x="1" y="7" width="12" height="8" fill="currentColor" />
                    </svg>
                  ) : (
                    <Stars n={stars} />
                  )}
                </div>
                <div className="mt-2 font-display text-lg font-bold leading-tight">{lv.name}</div>
                <div className="smallcaps mt-1 text-sand">
                  {lv.moves} moves · {lv.colors} colours
                </div>
                <div className="mt-2 border-t border-ink/25 pt-1.5 font-mono text-[0.66rem] text-ink/75">
                  {objectiveText(lv.objective)}
                </div>
                {best > 0 && (
                  <div className="smallcaps mt-1 text-sand">best {best.toLocaleString()}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playfield                                                           */
/* ------------------------------------------------------------------ */

type Status = "play" | "won" | "lost";

function Playfield({
  level,
  progress,
  onSave,
  onQuit,
  onNext,
  onReplay,
  muted,
  onMute,
}: {
  level: Level;
  progress: Match3Progress;
  onSave: (p: Match3Progress) => void;
  onQuit: () => void;
  onNext: (lv: Level) => void;
  onReplay: () => void;
  muted: boolean;
  onMute: () => void;
}) {
  const [board, setBoard] = useState<Board>(() => createBoard(level));
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(level.moves);
  const [collected, setCollected] = useState<Record<number, number>>({});
  const [sel, setSel] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("play");
  const [paused, setPaused] = useState(false);
  const [popping, setPopping] = useState<Set<number>>(new Set());
  const [pops, setPops] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [comboLabel, setComboLabel] = useState("");
  const [field, setField] = useState({ w: 0, h: 0 });
  const [powerUps, setPowerUps] = useState<PowerUp[]>(
    level.powerUps || [
      { type: "extra", uses: 2 },
      { type: "bomb", uses: 1 },
    ],
  );
  const [multiplier, setMultiplier] = useState(1);
  const multTimer = useRef<number | null>(null);

  const fieldRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<FxHandle>(null);
  const alive = useRef(true);
  const popId = useRef(0);
  const busy = useRef(false);

  // authoritative run values (state is only for painting)
  const scoreRef = useRef(0);
  const collectedRef = useRef<Record<number, number>>({});
  const movesRef = useRef(level.moves);
  const statusRef = useRef<Status>("play");
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  /* measure the felt area and derive an exact pixel board */
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setField({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const tile = Math.max(
    18,
    Math.floor(Math.min((field.w - 16) / board.cols, (field.h - 16) / board.rows)),
  );
  const boardW = tile * board.cols;
  const boardH = tile * board.rows;

  const centreOf = useCallback(
    (i: number) => ({ x: (colOf(board, i) + 0.5) * tile, y: (rowOf(board, i) + 0.5) * tile }),
    [board, tile],
  );

  const pushPop = useCallback(
    (i: number, text: string) => {
      const { x, y } = centreOf(i);
      const id = ++popId.current;
      setPops((p) => [...p, { id, x, y, text }]);
      setTimeout(() => {
        if (alive.current) setPops((p) => p.filter((q) => q.id !== id));
      }, 900);
    },
    [centreOf],
  );

  const paint = useCallback((b: Board) => {
    setBoard({ ...b, cells: [...b.cells] });
  }, []);

  const finish = useCallback(
    (won: boolean) => {
      statusRef.current = won ? "won" : "lost";
      setStatus(statusRef.current);
      if (won) {
        const final = scoreRef.current;
        const st = starsFor(level, final);
        onSave({
          stars: { ...progress.stars, [level.no]: Math.max(progress.stars[level.no] || 0, st) },
          best: { ...progress.best, [level.no]: Math.max(progress.best[level.no] || 0, final) },
        });
        sfx.clear();
        fxRef.current?.confetti(160);
      } else {
        sfx.over();
        fxRef.current?.shake(16);
      }
    },
    [level, progress, onSave],
  );

  /** Run every cascade until the board settles. */
  const resolve = useCallback(
    async (b: Board, anchor?: number, forcedStar?: { index: number; type: number }) => {
      let cascade = 0;

      for (;;) {
        const res = clearPass(b, cascade, anchor, cascade === 0 ? forcedStar : undefined, multiplier);
        if (!res) break;

        scoreRef.current += res.points;
        for (const [t, n] of Object.entries(res.byType)) {
          collectedRef.current[+t] = (collectedRef.current[+t] || 0) + n;
        }
        setScore(scoreRef.current);
        setCollected({ ...collectedRef.current });

        setPopping(new Set(res.cleared));
        for (const i of res.cleared.slice(0, 14)) {
          const { x, y } = centreOf(i);
          fxRef.current?.burst(x, y, { count: 7, power: 0.75 });
        }
        if (res.cleared.length) {
          sfx.snap(Math.min(5, cascade + 1));
          fxRef.current?.shake(3 + Math.min(10, res.cleared.length * 0.5));
          pushPop(res.cleared[0], `+${res.points}`);
        }
        if (cascade > 0) {
          setComboLabel(`CASCADE ×${cascade + 1}`);
          setTimeout(() => alive.current && setComboLabel(""), 800);
        }

        await sleep(190);
        if (!alive.current) return;
        setPopping(new Set());

        collapse(b);
        paint(b);
        await sleep(200);
        if (!alive.current) return;
        cascade++;
      }

      if (!hasMove(b)) {
        shuffleBoard(b);
        paint(b);
        sfx.clatter();
        await sleep(240);
      }
    },
    [centreOf, paint, pushPop],
  );

  const tryMove = useCallback(
    async (a: number, z: number) => {
      if (busy.current || statusRef.current !== "play" || pausedRef.current) return;
      const ca = board.cells[a];
      const cz = board.cells[z];
      if (!ca || !cz) return;

      // after the swap the star sits on the OTHER square
      const starSwap =
        ca.special === 2
          ? { index: z, type: cz.type }
          : cz.special === 2
            ? { index: a, type: ca.type }
            : undefined;

      if (!isValidSwap(board, a, z)) {
        busy.current = true;
        swapCells(board, a, z);
        paint(board);
        sfx.pickup();
        await sleep(150);
        if (alive.current) {
          swapCells(board, a, z);
          paint(board);
          fxRef.current?.shake(4);
        }
        busy.current = false;
        return;
      }

      busy.current = true;
      setSel(null);
      swapCells(board, a, z);
      paint(board);
      sfx.pickup();
      await sleep(170);
      if (!alive.current) return;

      movesRef.current -= 1;
      setMoves(movesRef.current);

      await resolve(board, z, starSwap);
      if (!alive.current) return;

      if (objectiveMet(level.objective, scoreRef.current, collectedRef.current)) finish(true);
      else if (movesRef.current <= 0) finish(false);

      busy.current = false;
    },
    [board, finish, level.objective, paint, resolve],
  );

  /* ---------- input: tap-tap and swipe ---------- */
  const dragRef = useRef<{ i: number; x: number; y: number } | null>(null);

  const cellFromEvent = (e: RPointerEvent<HTMLDivElement>): number | null => {
    const el = boardRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const c = Math.floor((e.clientX - r.left) / tile);
    const row = Math.floor((e.clientY - r.top) / tile);
    if (c < 0 || row < 0 || c >= board.cols || row >= board.rows) return null;
    return idx(board, row, c);
  };

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (busy.current || status !== "play" || paused) return;
    const i = cellFromEvent(e);
    if (i === null) return;
    dragRef.current = { i, x: e.clientX, y: e.clientY };
    if (sel === null) {
      setSel(i);
      sfx.pickup();
    } else if (sel === i) {
      setSel(null);
    } else {
      const dr = Math.abs(rowOf(board, sel) - rowOf(board, i));
      const dc = Math.abs(colOf(board, sel) - colOf(board, i));
      if (dr + dc === 1) void tryMove(sel, i);
      else {
        setSel(i);
        sfx.pickup();
      }
    }
  };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || busy.current || status !== "play") return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) < tile * 0.45) return;
    const r = rowOf(board, d.i);
    const c = colOf(board, d.i);
    let target: number | null = null;
    if (Math.abs(dx) > Math.abs(dy)) {
      const nc = c + (dx > 0 ? 1 : -1);
      if (nc >= 0 && nc < board.cols) target = idx(board, r, nc);
    } else {
      const nr = r + (dy > 0 ? 1 : -1);
      if (nr >= 0 && nr < board.rows) target = idx(board, nr, c);
    }
    dragRef.current = null;
    if (target !== null) void tryMove(d.i, target);
  };

  const onUp = () => {
    dragRef.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") onReplay();
      else if (e.key === "m" || e.key === "M") onMute();
      else if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        if (statusRef.current === "play") setPaused((p) => !p);
        else onQuit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onReplay, onMute, onQuit]);

  const stars = starsFor(level, score);
  const goalDone = useMemo(
    () => objectiveMet(level.objective, score, collected),
    [level.objective, score, collected],
  );
  const need = level.objective.kind === "collect" ? level.objective.need : [];

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-felt">
      <header className="paper grain relative z-20 shrink-0 border-b-2 border-ink">
        <div className="flex items-center gap-3 px-3 py-2 sm:px-5">
          <button
            className="icon-btn shrink-0"
            onClick={() => setPaused((p) => !p)}
            aria-label="Pause"
          >
            <svg width="12" height="13" viewBox="0 0 12 13" aria-hidden="true">
              <rect x="0" y="0" width="4" height="13" fill="currentColor" />
              <rect x="8" y="0" width="4" height="13" fill="currentColor" />
            </svg>
          </button>
          <div className="min-w-0 leading-tight">
            <div className="smallcaps text-sand">
              Level {String(level.no).padStart(2, "0")} · {level.name}
            </div>
            <div className="truncate font-mono text-[0.72rem] text-ink/80">
              {objectiveText(level.objective)}
            </div>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            <div className="text-right">
              <div className="smallcaps hidden text-sand sm:block">Score</div>
              <div className="tabular font-mono text-lg font-semibold leading-none sm:text-2xl">
                {score.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="smallcaps hidden text-sand sm:block">Moves</div>
              <div
                className={`tabular font-mono text-lg font-semibold leading-none sm:text-2xl ${
                  moves <= 3 ? "text-vermilion" : ""
                }`}
              >
                {moves}
              </div>
            </div>
            <button className="icon-btn shrink-0" onClick={onMute} aria-label="Mute">
              <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
                <path d="M0 5h3l4-4v12L3 9H0z" fill="currentColor" />
                {muted ? (
                  <path
                    d="M10 4l5 6M15 4l-5 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                  />
                ) : (
                  <path
                    d="M10 3.5a5 5 0 0 1 0 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* power-up buttons */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-ink/25 px-3 py-1.5 sm:px-5">
          {powerUps.map((pw, idx) => {
            const label =
              pw.type === "bomb"
                ? "Bomb (3×3)"
                : pw.type === "extra"
                  ? `+5 moves (${pw.uses})`
                  : pw.type === "shuffle"
                    ? "Shuffle"
                    : "2× score";
            return (
              <button
                key={idx}
                type="button"
                disabled={status !== "play" || pw.uses <= 0 || busy.current || paused}
                onClick={async () => {
                  if (busy.current || status !== "play" || pw.uses <= 0 || paused) return;
                  // For bomb: click a tile directly; for others apply globally
                  if (pw.type === "bomb") {
                    // Bomb activates on the currently selected tile
                    if (sel === null) return;
                    const result = applyPowerUp(board, { ...pw, uses: pw.uses - 1 }, sel);
                    if (result.cleared && result.cleared.length > 0) {
                      busy.current = true;
                      setPowerUps((arr) => {
                        const n = [...arr];
                        n[idx] = { ...pw, uses: pw.uses - 1 };
                        return n;
                      });
                      scoreRef.current += (result.cleared || []).length * 80;
                      setScore(scoreRef.current);
                      for (const i of result.cleared || []) setPopping(new Set([...popping, i]));
                      await sleep(200);
                      if (alive.current) {
                        setPopping(new Set());
                        paint(board);
                      }
                      await sleep(180);
                      if (alive.current) {
                        // no cascade here — just direct blast
                        if (!hasMove(board)) {
                          shuffleBoard(board);
                          paint(board);
                        }
                        busy.current = false;
                      }
                    } else {
                      setPowerUps((arr) => {
                        const n = [...arr];
                        n[idx] = { ...pw, uses: pw.uses - 1 };
                        return n;
                      });
                    }
                    return;
                  }

                  busy.current = true;
                  setPowerUps((arr) => {
                    const n = [...arr];
                    n[idx] = { ...pw, uses: pw.uses - 1 };
                    return n;
                  });

                  if (pw.type === "extra") {
                    movesRef.current += 5;
                    setMoves(movesRef.current);
                    sfx.tick(false);
                  } else if (pw.type === "shuffle") {
                    shuffleBoard(board);
                    paint(board);
                    sfx.clatter();
                    await sleep(240);
                  } else if (pw.type === "double") {
                    setMultiplier(2);
                    if (multTimer.current) window.clearTimeout(multTimer.current);
                    multTimer.current = window.setTimeout(() => {
                      if (alive.current) setMultiplier(1);
                    }, 8000);
                  }
                  busy.current = false;
                }}
                className={`shrink-0 border-2 px-2 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-wider transition ${
                  pw.uses <= 0
                    ? "border-ink/20 bg-ink/5 text-ink/30"
                    : "border-ink bg-kraft hover:bg-ochre/30"
                }`}
              >
                {label}
              </button>
            );
          })}
          <Stars n={stars} />
          {need.length > 0 ? (
            need.map((n) => {
              const got = Math.min(n.count, collected[n.type] || 0);
              const done = got >= n.count;
              return (
                <span
                  key={n.type}
                  className={`flex shrink-0 items-center gap-1.5 border-2 px-2 py-0.5 font-mono text-[0.7rem] ${
                    done ? "border-ink bg-vermilion text-kraft" : "border-ink/40"
                  }`}
                >
                  <span
                    className="inline-block h-3 w-3 border border-ink"
                    style={{ background: CANDIES[n.type].color }}
                  />
                  {got}/{n.count}
                </span>
              );
            })
          ) : (
            <span className="shrink-0 font-mono text-[0.7rem] text-sand">
              target {(level.objective as { score: number }).score.toLocaleString()}
            </span>
          )}
          {goalDone && status === "play" && (
            <span className="smallcaps anim-blink shrink-0 text-vermilion">order filled!</span>
          )}
          {comboLabel && (
            <span className="anim-pop ml-auto shrink-0 border-2 border-ink bg-ochre px-2 py-0.5 font-mono text-[0.7rem] font-semibold">
              {comboLabel}
            </span>
          )}
        </div>
      </header>

      <div
        ref={fieldRef}
        className="feltsurface relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
      >
        <div ref={shakeRef} className="flex items-center justify-center">
          <div
            ref={boardRef}
            className="relative border-2 border-ink bg-ink/25"
            style={{ width: boardW, height: boardH, touchAction: "none" }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {Array.from({ length: board.rows * board.cols }).map((_, i) => (
              <div
                key={`bg${i}`}
                className="absolute"
                style={{
                  left: colOf(board, i) * tile,
                  top: rowOf(board, i) * tile,
                  width: tile,
                  height: tile,
                  background:
                    (rowOf(board, i) + colOf(board, i)) % 2 === 0
                      ? "rgba(231,220,198,.06)"
                      : "transparent",
                }}
              />
            ))}

            {board.cells.map((cell, i) => {
              if (!cell) return null;
              const r = rowOf(board, i);
              const c = colOf(board, i);
              const candy = CANDIES[cell.type];
              const isSel = sel === i;
              const isPop = popping.has(i);
              return (
                <div
                  key={cell.id}
                  className="absolute"
                  style={{
                    left: 0,
                    top: 0,
                    width: tile,
                    height: tile,
                    padding: Math.max(1, Math.round(tile * 0.06)),
                    transform: `translate3d(${c * tile}px, ${r * tile}px, 0)`,
                    transition: "transform .19s cubic-bezier(.3,1.2,.5,1)",
                    zIndex: isSel ? 5 : 2,
                  }}
                >
                  <div
                    className={`relative flex h-full w-full items-center justify-center border-2 border-ink font-bold ${
                      isPop ? "m3-pop" : "m3-in"
                    } ${isSel ? "m3-sel" : ""}`}
                    style={{
                      background: candy.color,
                      color: cell.type === 3 ? "#1a1512" : "#f3ecdd",
                      fontSize: Math.round(tile * 0.42),
                      boxShadow: isSel
                        ? "0 0 0 3px var(--color-kraft), 3px 3px 0 var(--color-ink)"
                        : "2px 2px 0 rgba(0,0,0,.45)",
                    }}
                  >
                    <span aria-hidden="true">{candy.glyph}</span>
                    {cell.special === 1 && (
                      <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-kraft" />
                    )}
                    {cell.special === 2 && (
                      <span className="absolute inset-0 animate-pulse border-[3px] border-kraft" />
                    )}
                  </div>
                </div>
              );
            })}

            <Fx ref={fxRef} w={boardW} h={boardH} shakeEl={shakeRef} />

            <div className="pointer-events-none absolute inset-0 z-30">
              {pops.map((p) => (
                <div
                  key={p.id}
                  className="anim-float absolute -translate-x-1/2 -translate-y-1/2 font-mono text-lg font-semibold text-kraft drop-shadow-[0_2px_0_rgba(26,21,18,.9)]"
                  style={{ left: p.x, top: p.y }}
                >
                  {p.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {(status !== "play" || paused) && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink/65 px-4">
            <div className="paper grain w-full max-w-sm border-2 border-ink p-6 text-center shadow-[10px_10px_0_rgba(0,0,0,.55)]">
              {status === "won" ? (
                <>
                  <div className="smallcaps text-sand">Order filled</div>
                  <div className="font-display text-4xl font-black leading-none">LEVEL CLEAR</div>
                  <div className="mt-3 flex justify-center">
                    <Stars n={stars} size={26} />
                  </div>
                  <div className="tabular mt-2 font-mono text-2xl font-semibold">
                    {score.toLocaleString()}
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    {level.no < LEVELS.length && (
                      <button className="btn btn-primary" onClick={() => onNext(LEVELS[level.no])}>
                        Next level
                      </button>
                    )}
                    <div className="flex gap-3">
                      <button className="btn btn-ghost flex-1" onClick={onReplay}>
                        Replay
                      </button>
                      <button className="btn btn-ghost flex-1" onClick={onQuit}>
                        Levels
                      </button>
                    </div>
                  </div>
                </>
              ) : status === "lost" ? (
                <>
                  <div className="smallcaps text-sand">Out of moves</div>
                  <div className="font-display text-4xl font-black leading-none">
                    ORDER
                    <br />
                    MISSED
                  </div>
                  <div className="tabular mt-3 font-mono text-2xl font-semibold">
                    {score.toLocaleString()}
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <button className="btn btn-primary" onClick={onReplay}>
                      Try again
                      <span className="border border-kraft/60 px-1.5 py-0.5 font-mono text-[0.65rem]">
                        R
                      </span>
                    </button>
                    <button className="btn btn-ghost" onClick={onQuit}>
                      Levels
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="smallcaps text-sand">Sweet shop paused</div>
                  <div className="font-display text-4xl font-black leading-none">PAUSED</div>
                  <div className="mt-6 flex flex-col gap-3">
                    <button className="btn btn-primary" onClick={() => setPaused(false)}>
                      Resume
                    </button>
                    <div className="flex gap-3">
                      <button className="btn btn-ghost flex-1" onClick={onReplay}>
                        Restart
                      </button>
                      <button className="btn btn-ghost flex-1" onClick={onQuit}>
                        Levels
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function Match3({
  onExit,
  muted,
  onMute,
}: {
  onExit: () => void;
  muted: boolean;
  onMute: () => void;
}) {
  const [progress, setProgress] = useState<Match3Progress>(() => loadProgress());
  const [level, setLevel] = useState<Level | null>(null);
  const [runId, setRunId] = useState(0);

  const save = useCallback((p: Match3Progress) => {
    setProgress(p);
    saveProgress(p);
  }, []);

  if (!level) {
    return (
      <LevelMap
        progress={progress}
        onPlay={(lv) => {
          setRunId((r) => r + 1);
          setLevel(lv);
        }}
        onExit={onExit}
      />
    );
  }

  return (
    <Playfield
      // only a deliberate replay/level change remounts the board
      key={`${level.no}-${runId}`}
      level={level}
      progress={progress}
      onSave={save}
      onQuit={() => setLevel(null)}
      onNext={(lv) => {
        setRunId((r) => r + 1);
        setLevel(lv);
      }}
      onReplay={() => setRunId((r) => r + 1)}
      muted={muted}
      onMute={onMute}
    />
  );
}
