// @ts-nocheck
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as RPointerEvent } from "react";
import { buildPuzzle, makeRng, scatterPieces } from "../../lib/jigsaw";
import type { PuzzlePiece } from "../../lib/jigsaw";
import { Fx } from "./Fx";
import type { FxHandle } from "./Fx";
import * as sfx from "../../lib/audio";

type Placed = PuzzlePiece & { dx: number; dy: number; snapped: boolean };
type Phase = "deal" | "play" | "clear" | "over";

type Layout = {
  board: { x: number; y: number; w: number; h: number };
  BW: number;
  BH: number;
  snapR: number;
  narrow: boolean;
};

type Props = {
  sheet: { src: string; title: string; no: string };
  round: number;
  cols: number;
  rows: number;
  roundTime: number;
  score: number;
  onDelta: (d: number) => void;
  onSnap: () => void;
  onAdvance: () => void;
  onOver: () => void;
  onQuit: () => void;
  onRestart: () => void;
  muted: boolean;
  onMute: () => void;
};

const fmt = (s: number) => {
  const v = Math.max(0, Math.round(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
};

function Ticker({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) {
      el.textContent = String(to);
      return;
    }
    const t0 = performance.now();
    let raf = requestAnimationFrame(function step(t) {
      const k = Math.min(1, (t - t0) / 380);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(from + (to - from) * e));
      if (k < 1) raf = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

export default function GameBoard(props: Props) {
  const cb = useRef(props);
  cb.current = props;

  const feltRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<FxHandle>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timeTextRef = useRef<HTMLDivElement>(null);
  const elRefs = useRef<(HTMLDivElement | null)[]>([]);
  const piecesRef = useRef<Placed[]>([]);
  const layoutRef = useRef<Layout | null>(null);
  const timers = useRef<number[]>([]);
  const popId = useRef(0);
  const lastShownT = useRef(-1);
  const dragRef = useRef<{ i: number; sx: number; sy: number; dx: number; dy: number; moved: boolean } | null>(null);
  const phaseRef = useRef<Phase>("deal");
  const pausedRef = useRef(false);
  const timeRef = useRef(props.roundTime);
  const comboRef = useRef(1);
  const lastSnapRef = useRef(0);
  const selectedRef = useRef(0);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });
  sizeRef.current = size;
  const [layout, setLayout] = useState<Layout | null>(null);
  const [pieces, setPieces] = useState<Placed[]>([]);
  const [phase, setPhaseState] = useState<Phase>("deal");
  const [paused, setPausedState] = useState(false);
  const [combo, setCombo] = useState(1);
  const [nearId, setNearId] = useState(-1);
  const [grabbed, setGrabbed] = useState(-1);
  const [selected, setSelected] = useState(0);
  const [dealing, setDealing] = useState(true);
  const [bonus, setBonus] = useState(0);
  const [popups, setPopups] = useState<
    { id: number; x: number; y: number; label: string; sub: string }[]
  >([]);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };
  const setPaused = (v: boolean) => {
    pausedRef.current = v;
    setPausedState(v);
  };
  const select = (i: number) => {
    selectedRef.current = i;
    setSelected(i);
  };
  const after = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  /* ---------- measure the felt ---------- */
  useLayoutEffect(() => {
    const el = feltRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setSize((prev) =>
        Math.abs(prev.w - r.width) > 3 || Math.abs(prev.h - r.height) > 3
          ? { w: Math.round(r.width), h: Math.round(r.height) }
          : prev,
      );
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---------- cut the sheet & deal the pieces ---------- */
  const builtRef = useRef<{ w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    if (size.w < 80 || size.h < 80) return;
    const prev = builtRef.current;
    if (prev && Math.abs(prev.w - size.w) < 56 && Math.abs(prev.h - size.h) < 72) return;
    builtRef.current = { w: size.w, h: size.h };

    const { cols, rows, round } = cb.current;
    const narrow = size.w < 820;
    // margins are sized so the loose pieces always have somewhere to land
    const marginX = narrow ? 14 : Math.max(72, size.w * 0.13);
    const marginTop = narrow ? 14 : Math.max(72, size.h * 0.17);
    const marginBottom = narrow
      ? Math.max(96, Math.min(size.h * 0.34, 190))
      : Math.max(80, size.h * 0.19);
    const maxW = Math.max(160, size.w - marginX * 2);
    const maxH = Math.max(120, size.h - marginTop - marginBottom);
    let BW = narrow ? Math.min(maxW, Math.max(210, size.w * 0.8)) : maxW;
    let BH = (BW * 2) / 3;
    if (BH > maxH) {
      BH = maxH;
      BW = BH * 1.5;
    }
    const board = {
      x: Math.round((size.w - BW) / 2),
      y: Math.round(marginTop + (maxH - BH) * (narrow ? 0.25 : 0.5)),
      w: Math.round(BW),
      h: Math.round(BH),
    };
    BW = board.w;
    BH = board.h;
    const snapR = Math.max(26, Math.min(BW / cols, BH / rows) * 0.3);
    const nextLayout: Layout = { board, BW, BH, snapR, narrow };
    layoutRef.current = nextLayout;
    setLayout(nextLayout);

    const rng = makeRng(Date.now() % 999983 + round * 7919 + cols * 31);
    const pz = buildPuzzle(cols, rows, BW, BH, rng);
    const spots = scatterPieces(pz.pieces, board, size, rng);
    const old = piecesRef.current;
    const next: Placed[] = pz.pieces.map((p, i) => {
      const wasSnapped = !!old[i]?.snapped;
      return {
        ...p,
        dx: wasSnapped ? 0 : spots[i].dx,
        dy: wasSnapped ? 0 : spots[i].dy,
        snapped: wasSnapped,
      };
    });
    piecesRef.current = next;
    setPieces(next);
    const firstFree = next.findIndex((p) => !p.snapped);
    select(firstFree < 0 ? 0 : firstFree);
    elRefs.current = [];
  }, [size, cb.current.cols, cb.current.rows, cb.current.round]);

  /* ---------- round intro ---------- */
  useEffect(() => {
    timeRef.current = cb.current.roundTime;
    lastShownT.current = -1;
    updateHud();
    after(() => {
      if (phaseRef.current === "deal") {
        setPhase("play");
        lastSnapRef.current = 0;
        setDealing(false);
      }
    }, 780);
    const onVis = () => {
      if (document.hidden && phaseRef.current === "play") setPaused(true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateHud() {
    const t = timeRef.current;
    const pct = Math.max(0, Math.min(1, t / cb.current.roundTime));
    const bar = barRef.current;
    if (bar) {
      bar.style.width = `${(pct * 100).toFixed(2)}%`;
      bar.style.background = t <= 10 ? "#d99a2b" : "#e0451f";
    }
    const shown = Math.ceil(t);
    if (shown !== lastShownT.current) {
      lastShownT.current = shown;
      if (timeTextRef.current) timeTextRef.current.textContent = fmt(shown);
      if (phaseRef.current === "play" && !pausedRef.current && shown > 0 && shown <= 10) sfx.tick(true);
    }
  }

  /* ---------- clock ---------- */
  const overRun = useRef(false);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.06, (t - last) / 1000);
      last = t;
      if (phaseRef.current === "play" && !pausedRef.current) {
        timeRef.current = Math.max(0, timeRef.current - dt);
        updateHud();
        if (timeRef.current <= 0 && !overRun.current) {
          overRun.current = true;
          setPhase("over");
          sfx.over();
          fxRef.current?.shake(20);
          after(() => cb.current.onOver(), 780);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPos = (i: number) => {
    const el = elRefs.current[i];
    const p = piecesRef.current[i];
    if (el && p) el.style.transform = `translate3d(${p.dx}px, ${p.dy}px, 0)`;
  };

  /** keep a piece inside the felt so it can never be lost off the table */
  const clampPos = (p: Placed, L: Layout, x: number, y: number): [number, number] => {
    const W = sizeRef.current.w;
    const H = sizeRef.current.h;
    const halfW = p.w / 2;
    const halfH = p.h / 2;
    let nx = x;
    let ny = y;
    if (halfW * 2 < W) {
      const cx = L.board.x + p.x + halfW + x;
      if (cx < halfW) nx += halfW - cx;
      else if (cx > W - halfW) nx -= cx - (W - halfW);
    }
    if (halfH * 2 < H) {
      const cy = L.board.y + p.y + halfH + y;
      if (cy < halfH) ny += halfH - cy;
      else if (cy > H - halfH) ny -= cy - (H - halfH);
    }
    return [nx, ny];
  };

  const pushPopup = (x: number, y: number, label: string, sub: string) => {
    const id = ++popId.current;
    setPopups((ps) => [...ps, { id, x, y, label, sub }]);
    after(() => setPopups((ps) => ps.filter((q) => q.id !== id)), 1000);
  };

  const completeRound = () => {
    if (phaseRef.current !== "play") return;
    setPhase("clear");
    const b = Math.round(timeRef.current) * 20 + 300 * cb.current.round;
    setBonus(b);
    cb.current.onDelta(b);
    sfx.clear();
    fxRef.current?.confetti(170);
    fxRef.current?.shake(15);
    after(() => cb.current.onAdvance(), 2450);
  };

  const commitSnap = (i: number) => {
    const p = piecesRef.current[i];
    const L = layoutRef.current;
    if (!p || p.snapped || !L) return;
    p.snapped = true;
    p.dx = 0;
    p.dy = 0;

    const now = performance.now();
    comboRef.current = now - lastSnapRef.current < 4000 ? Math.min(5, comboRef.current + 1) : 1;
    lastSnapRef.current = now;
    setCombo(comboRef.current);

    const pts = 100 * comboRef.current;
    cb.current.onDelta(pts);
    cb.current.onSnap();
    timeRef.current = Math.min(cb.current.roundTime * 1.6, timeRef.current + 1.2);
    updateHud();
    sfx.snap(comboRef.current);

    const cx = L.board.x + p.x + p.w / 2;
    const cy = L.board.y + p.y + p.h / 2;
    fxRef.current?.burst(cx, cy, { count: 12 + comboRef.current * 4 });
    fxRef.current?.shake(3.5 + comboRef.current * 1.6);
    pushPopup(cx, cy, `+${pts}`, comboRef.current > 1 ? `×${comboRef.current} COMBO` : "NICE FIT");

    const el = elRefs.current[i];
    if (el) {
      el.classList.add("snapanim");
      window.setTimeout(() => el.classList.remove("snapanim"), 260);
    }
    setNearId(-1);
    setPieces([...piecesRef.current]);

    if (piecesRef.current.every((q) => q.snapped)) after(completeRound, 300);
  };

  /* ---------- pointer ---------- */
  const startDrag = (e: RPointerEvent<HTMLDivElement>, i: number) => {
    if (phaseRef.current !== "play" || pausedRef.current) return;
    const p = piecesRef.current[i];
    if (!p || p.snapped) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    dragRef.current = { i, sx: e.clientX, sy: e.clientY, dx: p.dx, dy: p.dy, moved: false };
    setGrabbed(i);
    select(i);
    sfx.pickup();
  };

  const moveDrag = (e: RPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    const L = layoutRef.current;
    if (!d || !L) return;
    const p = piecesRef.current[d.i];
    if (!p) return;
    if (p.snapped) {
      dragRef.current = null;
      setGrabbed(-1);
      return;
    }
    const rx = d.dx + (e.clientX - d.sx);
    const ry = d.dy + (e.clientY - d.sy);
    if (Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) > 5) d.moved = true;

    let x = rx;
    let y = ry;
    const d0 = Math.hypot(rx, ry);
    const magnet = L.snapR * 1.7;
    if (d0 < magnet && d0 > 0.001) {
      const k = 1 - 0.5 * (1 - d0 / magnet);
      x = rx * k;
      y = ry * k;
    }
    const clamped = clampPos(p, L, x, y);
    x = clamped[0];
    y = clamped[1];
    p.dx = x;
    p.dy = y;
    applyPos(d.i);

    const dist = Math.hypot(x, y);
    const id = dist < L.snapR * 2.6 ? p.id : -1;
    setNearId((prev) => (prev === id ? prev : id));
    if (dist < L.snapR * 0.96) commitSnap(d.i);
  };

  const endDrag = () => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    setGrabbed(-1);
    const p = piecesRef.current[d.i];
    const L = layoutRef.current;
    if (!p || !L) return;
    if (Math.hypot(p.dx, p.dy) < L.snapR * 0.96) {
      commitSnap(d.i);
      return;
    }
    setNearId(-1);
    if (d.moved && Math.hypot(p.dx, p.dy) < L.snapR * 3.5) {
      sfx.clatter();
      fxRef.current?.shake(3);
    }
  };

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const cycle = (dir: number) => {
      const arr = piecesRef.current;
      if (!arr.length) return;
      let i = selectedRef.current;
      for (let n = 0; n < arr.length; n++) {
        i = (i + dir + arr.length) % arr.length;
        if (!arr[i].snapped) {
          select(i);
          sfx.pickup();
          return;
        }
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "m" || k === "M") {
        cb.current.onMute();
        return;
      }
      if (k === "p" || k === "P" || k === "Escape") {
        if (phaseRef.current === "play" || phaseRef.current === "deal") {
          e.preventDefault();
          setPaused(!pausedRef.current);
        }
        return;
      }
      if ((k === "r" || k === "R") && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        cb.current.onRestart();
        return;
      }
      if (phaseRef.current !== "play" || pausedRef.current) return;
      const L = layoutRef.current;
      if (!L) return;

      if (k === "Tab" || k === "q" || k === "Q" || k === "e" || k === "E") {
        e.preventDefault();
        cycle(k.toLowerCase() === "q" || e.shiftKey ? -1 : 1);
        return;
      }

      const step = e.shiftKey ? 42 : 13;
      let dx = 0;
      let dy = 0;
      if (k === "ArrowLeft") dx = -step;
      else if (k === "ArrowRight") dx = step;
      else if (k === "ArrowUp") dy = -step;
      else if (k === "ArrowDown") dy = step;
      if (dx || dy) {
        e.preventDefault();
        const i = selectedRef.current;
        const p = piecesRef.current[i];
        if (!p || p.snapped) return;
        const clamped = clampPos(p, L, p.dx + dx, p.dy + dy);
        p.dx = clamped[0];
        p.dy = clamped[1];
        applyPos(i);
        const dist = Math.hypot(p.dx, p.dy);
        setNearId(dist < L.snapR * 2.6 ? p.id : -1);
        if (dist < L.snapR * 0.96) commitSnap(i);
        return;
      }

      if (k === " " || k === "Enter") {
        e.preventDefault();
        const i = selectedRef.current;
        const p = piecesRef.current[i];
        if (!p || p.snapped) return;
        p.dx *= 0.32;
        p.dy *= 0.32;
        applyPos(i);
        const dist = Math.hypot(p.dx, p.dy);
        setNearId(p.id);
        sfx.pickup();
        if (dist < L.snapR * 0.96) commitSnap(i);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePause = () => {
    if (phaseRef.current !== "play" && phaseRef.current !== "deal") return;
    setPaused(!pausedRef.current);
  };

  const left = pieces.filter((p) => !p.snapped).length;
  const board = layout?.board;
  const BW = layout?.BW ?? 0;
  const BH = layout?.BH ?? 0;

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-felt">
      {/* ---------------- HUD ---------------- */}
      <header className="paper grain relative z-20 shrink-0 border-b-2 border-ink">
        <div className="flex items-center gap-3 px-3 py-2 sm:gap-4 sm:px-5">
          <button className="icon-btn shrink-0" onClick={togglePause} aria-label="Pause game">
            <svg width="12" height="13" viewBox="0 0 12 13" aria-hidden="true">
              <rect x="0" y="0" width="4" height="13" fill="currentColor" />
              <rect x="8" y="0" width="4" height="13" fill="currentColor" />
            </svg>
          </button>
          <div className="relative hidden h-9 w-14 shrink-0 overflow-hidden border border-ink sm:block">
            <img src={props.sheet.src} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="smallcaps text-sand">
              Sheet {props.sheet.no} · Round {props.round} · {props.cols}×{props.rows}
            </div>
            <div className="truncate font-display text-base font-bold sm:text-lg">
              {props.sheet.title}
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-6">
            {combo > 1 && (
              <div className="anim-pop border-2 border-ink bg-vermilion px-2 py-1 font-mono text-xs font-semibold text-kraft sm:text-sm">
                ×{combo}
              </div>
            )}
            <div className="text-right">
              <div className="smallcaps hidden text-sand sm:block">Score</div>
              <Ticker
                value={props.score}
                className="tabular block font-mono text-lg font-semibold leading-none sm:text-2xl"
              />
            </div>
            <div className="text-right">
              <div className="smallcaps hidden text-sand sm:block">Time</div>
              <div
                ref={timeTextRef}
                className="tabular font-mono text-lg font-semibold leading-none sm:text-2xl"
              >
                {fmt(props.roundTime)}
              </div>
            </div>
            <button
              className="icon-btn shrink-0"
              onClick={props.onMute}
              aria-label={props.muted ? "Unmute" : "Mute"}
            >
              <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
                <path d="M0 5h3l4-4v12L3 9H0z" fill="currentColor" />
                {props.muted ? (
                  <path d="M10 4l5 6M15 4l-5 6" stroke="currentColor" strokeWidth="1.6" fill="none" />
                ) : (
                  <path
                    d="M10 3.5a5 5 0 0 1 0 7M12.5 1.5a8 8 0 0 1 0 11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        <div className="h-[7px] w-full border-t border-ink/25 bg-ink/12">
          <div
            ref={barRef}
            className="h-full"
            style={{ width: "100%", background: "#e0451f", transition: "width .12s linear" }}
          />
        </div>
      </header>

      {/* ---------------- FELT ---------------- */}
      <div ref={feltRef} className="feltsurface relative flex-1 overflow-hidden">
        <div ref={shakeRef} className="absolute inset-0">
          {layout && board && (
            <>
              <div
                className="absolute"
                style={{
                  left: board.x,
                  top: board.y,
                  width: BW,
                  height: BH,
                  background: "rgba(0,0,0,.26)",
                  boxShadow: "inset 0 0 70px rgba(0,0,0,.45)",
                }}
              />
              <div
                className="pointer-events-none absolute"
                style={{
                  left: board.x - 12,
                  top: board.y - 12,
                  width: BW + 24,
                  height: BH + 24,
                  border: "1px dashed rgba(231,220,198,.32)",
                }}
              />
              <div
                className="smallcaps pointer-events-none absolute whitespace-nowrap"
                style={{ left: board.x, top: board.y + BH + 16 }}
              >
                {left === pieces.length && phase !== "over" ? (
                  <span className="anim-blink inline-block border border-ink bg-kraft px-2 py-1 text-ink">
                    → drag a piece onto the sheet
                  </span>
                ) : (
                  <span className="text-kraft/75">
                    {props.cols}×{props.rows} · {left} loose · {pieces.length - left} home
                  </span>
                )}
              </div>

              <div
                className="absolute"
                style={
                  {
                    left: board.x,
                    top: board.y,
                    width: BW,
                    height: BH,
                    // one copy of the artwork for every piece to read from
                    "--sheet": `url("${props.sheet.src}")`,
                  } as CSSProperties
                }
              >
                {pieces.map(
                  (p) =>
                    !p.snapped && (
                      <div
                        key={`g${p.id}`}
                        className={`ghost${nearId === p.id ? " near" : ""}`}
                        style={{
                          left: p.x,
                          top: p.y,
                          width: p.w,
                          height: p.h,
                          clipPath: `path("${p.d}")`,
                        }}
                      />
                    ),
                )}
                {/* the die-lines themselves: one static stroke layer that reads as
                    printed cut marks over both the empty sheet and the finished picture */}
                <svg
                  className="pointer-events-none absolute left-0 top-0"
                  width={BW}
                  height={BH}
                  viewBox={`0 0 ${BW} ${BH}`}
                  style={{ zIndex: 2 }}
                  aria-hidden="true"
                >
                  {pieces.map((p) => (
                    <path
                      key={`cut${p.id}`}
                      d={p.d}
                      transform={`translate(${p.x} ${p.y})`}
                      fill="none"
                      stroke={p.snapped ? "rgba(12,10,8,.62)" : "rgba(231,220,198,.4)"}
                      strokeWidth={p.snapped ? 1.3 : 1}
                    />
                  ))}
                </svg>
                {pieces.map((p, i) => {
                  const isNear = !p.snapped && nearId === p.id;
                  const isSel = !p.snapped && !isNear && selected === p.id;
                  const glow = isNear;
                  const selRing = isSel;
                  return (
                    <div
                      key={p.id}
                      ref={(el) => {
                        elRefs.current[i] = el;
                      }}
                      className={`piece${p.snapped ? " snapped" : ""}${grabbed === i ? " grabbed" : ""}${dealing ? " dealing" : ""}`}
                      style={{
                        left: p.x,
                        top: p.y,
                        width: p.w,
                        height: p.h,
                        transform: `translate3d(${p.dx}px, ${p.dy}px, 0)`,
                        zIndex: p.snapped ? 1 : grabbed === i ? 40 : 10 + i,
                      }}
                    >
                      <div
                        className="piece-face"
                        style={{
                          backgroundSize: `${BW}px ${BH}px`,
                          backgroundPosition: `${-p.x}px ${-p.y}px`,
                          clipPath: `path("${p.d}")`,
                          animationDelay: `${i * 14}ms`,
                        }}
                        onPointerDown={(e) => startDrag(e, i)}
                        onPointerMove={moveDrag}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                      />
                      {(glow || selRing) && (
                        <div
                          className="piece-glow"
                          style={{
                            clipPath: `path("${p.d}")`,
                            background: glow
                              ? "rgba(224,69,31,.34)"
                              : "rgba(231,220,198,.2)",
                            animation: glow ? "ghostpulse .7s ease-in-out infinite alternate" : undefined,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <Fx ref={fxRef} w={size.w} h={size.h} shakeEl={shakeRef} />

        {/* score popups */}
        <div className="pointer-events-none absolute inset-0 z-40">
          {popups.map((p) => (
            <div
              key={p.id}
              className="anim-float absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: p.x, top: p.y }}
            >
              <div className="tabular font-mono text-2xl font-semibold text-kraft drop-shadow-[0_2px_0_rgba(26,21,18,.9)]">
                {p.label}
              </div>
              <div className="smallcaps text-vermilion drop-shadow-[0_1px_0_rgba(26,21,18,.9)]">
                {p.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ---------- overlays ---------- */}
        {phase === "deal" && (
          <div className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center">
            <div className="anim-banner border-2 border-ink bg-kraft px-6 py-4 text-center shadow-[8px_8px_0_rgba(0,0,0,.55)]">
              <div className="smallcaps text-sand">Round {props.round}</div>
              <div className="font-display text-3xl font-black leading-none sm:text-5xl">
                {props.sheet.title}
              </div>
              <div className="smallcaps mt-2 text-vermilion">
                {props.cols * props.rows} pieces · {fmt(props.roundTime)}
              </div>
            </div>
          </div>
        )}

        {phase === "clear" && (
          <div className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center bg-ink/25">
            <div className="anim-banner border-2 border-ink bg-kraft px-7 py-5 text-center shadow-[10px_10px_0_rgba(0,0,0,.55)]">
              <div className="font-display text-4xl font-black leading-none sm:text-6xl">
                SHEET
                <br />
                COMPLETE
              </div>
              <div className="tabular mt-3 font-mono text-xl font-semibold text-vermilion">
                +{bonus.toLocaleString()}
              </div>
              <div className="smallcaps mt-1 text-sand">
                time bonus · cutting sheet {props.round + 1}…
              </div>
            </div>
          </div>
        )}

        {phase === "over" && (
          <div className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center bg-ink/55">
            <div className="anim-banner text-center">
              <div className="font-display text-6xl font-black text-kraft sm:text-8xl">TIME</div>
              <div className="smallcaps anim-blink mt-2 text-vermilion">the box is closed</div>
            </div>
          </div>
        )}

        {paused && phase !== "over" && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center bg-ink/60 px-4">
            <div className="paper grain w-full max-w-sm border-2 border-ink p-6 shadow-[10px_10px_0_rgba(0,0,0,.55)]">
              <div className="smallcaps text-sand">Table paused</div>
              <div className="font-display text-4xl font-black leading-none">PAUSED</div>
              <dl className="mt-5 space-y-2 font-mono text-[0.74rem]">
                {[
                  ["SELECT PIECE", "TAB · Q / E"],
                  ["MOVE PIECE", "ARROWS"],
                  ["MAGNETISE", "SPACE"],
                  ["RESTART", "R"],
                  ["MUTE", "M"],
                ].map(([a, b]) => (
                  <div key={a} className="flex items-baseline gap-2">
                    <dt className="text-sand">{a}</dt>
                    <dd className="flex-1 border-b border-dotted border-ink/40" />
                    <dd>{b}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-col gap-3">
                <button className="btn btn-primary" onClick={togglePause}>
                  Resume
                </button>
                <div className="flex gap-3">
                  <button className="btn btn-ghost flex-1" onClick={props.onRestart}>
                    Restart
                  </button>
                  <button className="btn btn-ghost flex-1" onClick={props.onQuit}>
                    Quit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
