// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  bestMove,
  colorOf,
  file,
  inCheck,
  initialState,
  kingSquare,
  loadRecord,
  makeMove,
  movesFrom,
  outcome,
  rank,
  saveRecord,
  square,
  toSan,
} from "../../lib/chess";
import type { ChessRecord, Color, Difficulty, Move, State } from "../../lib/chess";
import * as sfx from "../../lib/audio";

const GLYPH: Record<string, string> = {
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

const DIFFS: { id: Difficulty; label: string; note: string }[] = [
  { id: "easy", label: "Apprentice", note: "loose, forgiving" },
  { id: "medium", label: "Club", note: "looks two ahead" },
  { id: "hard", label: "Master", note: "looks three ahead" },
];

function PieceGlyph({ piece, size }: { piece: string; size: number }) {
  const white = colorOf(piece) === "w";
  return (
    <span
      className="select-none leading-none"
      style={{
        fontSize: size,
        color: white ? "#f4ecdb" : "#1a1512",
        textShadow: white
          ? "0 0 1px #1a1512, 1px 1px 0 #1a1512, -1px 1px 0 #1a1512, 1px -1px 0 #1a1512, -1px -1px 0 #1a1512, 0 3px 4px rgba(0,0,0,.4)"
          : "0 1px 0 rgba(231,220,198,.35), 0 3px 4px rgba(0,0,0,.35)",
      }}
      aria-hidden="true"
    >
      {GLYPH[piece.toLowerCase()]}
    </span>
  );
}

/* ------------------------------------------------------------------ */

export default function Chess({
  onExit,
  muted,
  onMute,
}: {
  onExit: () => void;
  muted: boolean;
  onMute: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [side, setSide] = useState<Color>("w");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [record, setRecord] = useState<ChessRecord>(() => loadRecord());

  const [history, setHistory] = useState<State[]>([initialState()]);
  const [sans, setSans] = useState<string[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [last, setLast] = useState<Move | null>(null);
  const [thinking, setThinking] = useState(false);
  const [promo, setPromo] = useState<{ from: number; to: number } | null>(null);
  const [flash, setFlash] = useState(false);
  const recorded = useRef(false);
  const alive = useRef(true);

  const state = history[history.length - 1];
  const result = useMemo(() => outcome(state), [state]);
  const legal = useMemo(() => (sel === null ? [] : movesFrom(state, sel)), [state, sel]);
  const check = useMemo(() => inCheck(state), [state]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const applyMove = useCallback(
    (m: Move) => {
      setHistory((h) => {
        const cur = h[h.length - 1];
        const san = toSan(cur, m);
        setSans((s) => [...s, san]);
        const next = makeMove(cur, m);
        if (m.captured) sfx.clatter();
        else sfx.pickup();
        if (inCheck(next)) {
          sfx.snap(3);
          setFlash(true);
          setTimeout(() => alive.current && setFlash(false), 420);
        }
        return [...h, next];
      });
      setLast(m);
      setSel(null);
    },
    [],
  );

  /* engine turn */
  useEffect(() => {
    if (!started || result.over) return;
    if (state.turn === side) return;
    setThinking(true);
    const t = setTimeout(() => {
      const m = bestMove(state, difficulty);
      if (m && alive.current) applyMove(m);
      if (alive.current) setThinking(false);
    }, 240);
    return () => clearTimeout(t);
  }, [started, state, side, difficulty, result.over, applyMove]);

  /* record the finished game once */
  useEffect(() => {
    if (!started || !result.over || recorded.current) return;
    recorded.current = true;
    const next = { ...record };
    if (result.result === "checkmate") {
      if (result.winner === side) {
        next.w++;
        sfx.clear();
      } else {
        next.l++;
        sfx.over();
      }
    } else {
      next.d++;
      sfx.start();
    }
    setRecord(next);
    saveRecord(next);
  }, [result, started, side, record]);

  const newGame = useCallback(
    (asSide: Color = side, diff: Difficulty = difficulty) => {
      recorded.current = false;
      setHistory([initialState()]);
      setSans([]);
      setSel(null);
      setLast(null);
      setPromo(null);
      setSide(asSide);
      setDifficulty(diff);
      setStarted(true);
      sfx.ensureAudio();
      sfx.start();
    },
    [side, difficulty],
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      // step back over the engine reply too
      const back = h.length >= 3 ? 2 : 1;
      setSans((s) => s.slice(0, Math.max(0, s.length - back)));
      return h.slice(0, h.length - back);
    });
    setSel(null);
    setLast(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started) return;
      if (e.key === "u" || e.key === "U") undo();
      else if (e.key === "n" || e.key === "N") newGame();
      else if (e.key === "m" || e.key === "M") onMute();
      else if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, undo, newGame, onMute, onExit]);

  const clickSquare = (i: number) => {
    if (result.over || thinking || state.turn !== side) return;
    const piece = state.board[i];

    if (sel !== null) {
      const m = legal.find((x) => x.to === i);
      if (m) {
        if (m.promo) setPromo({ from: sel, to: i });
        else applyMove(m);
        return;
      }
    }
    if (piece && colorOf(piece) === state.turn) {
      setSel(i === sel ? null : i);
      sfx.pickup();
    } else {
      setSel(null);
    }
  };

  const finishPromo = (kind: string) => {
    if (!promo) return;
    const m = movesFrom(state, promo.from).find((x) => x.to === promo.to && x.promo === kind);
    if (m) applyMove(m);
    setPromo(null);
  };

  /* ---------------- start screen ---------------- */
  if (!started) {
    return (
      <div className="paper h-[100dvh] w-full overflow-y-auto">
        <div className="grain mx-auto min-h-full max-w-[860px] px-5 pb-14 sm:px-7">
          <div className="flex items-center justify-between border-b-2 border-ink py-3">
            <button className="btn btn-ghost !px-3 !py-1.5 text-[0.68rem]" onClick={onExit}>
              ← Arcade
            </button>
            <span className="smallcaps text-sand">
              {record.w}W · {record.l}L · {record.d}D
            </span>
          </div>

          <div className="pt-8">
            <p className="smallcaps text-vermilion">Two players, one board</p>
            <h1 className="mt-1 font-display text-[clamp(3rem,11vw,6rem)] font-black leading-[0.82] tracking-[-0.035em]">
              THE
              <br />
              BOARD
            </h1>
            <p className="mt-4 max-w-[48ch] text-ink/80">
              Full rules — castling, en passant, promotion, stalemate and the fifty-move draw.
              The engine searches with alpha-beta pruning; pick how deep it looks.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="smallcaps mb-2 border-b-2 border-ink pb-1">Play as</div>
              <div className="flex gap-2">
                {(["w", "b"] as Color[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSide(c)}
                    className={`flex flex-1 items-center justify-center gap-2 border-2 py-3 font-mono text-sm font-semibold uppercase tracking-wider transition ${
                      side === c
                        ? "border-ink bg-vermilion text-kraft shadow-[4px_4px_0_var(--color-ink)]"
                        : "border-ink/40 hover:border-ink"
                    }`}
                  >
                    <PieceGlyph piece={c === "w" ? "K" : "k"} size={22} />
                    {c === "w" ? "White" : "Black"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="smallcaps mb-2 border-b-2 border-ink pb-1">Engine strength</div>
              <div className="flex flex-col gap-2">
                {DIFFS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`flex items-baseline justify-between gap-2 border-2 px-3 py-2 text-left transition ${
                      difficulty === d.id
                        ? "border-ink bg-ochre/30 shadow-[4px_4px_0_var(--color-ink)]"
                        : "border-ink/40 hover:border-ink"
                    }`}
                  >
                    <span className="font-display font-bold">{d.label}</span>
                    <span className="font-mono text-[0.66rem] text-sand">{d.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary mt-8" onClick={() => newGame(side, difficulty)}>
            Start game
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- board ---------------- */
  const flip = side === "b";
  const order = Array.from({ length: 64 }, (_, k) => (flip ? 63 - k : k));
  const kingSq = check ? kingSquare(state.board, state.turn) : -1;

  const statusLine = result.over
    ? result.result === "checkmate"
      ? result.winner === side
        ? "Checkmate — you win"
        : "Checkmate — engine wins"
      : result.result === "stalemate"
        ? "Stalemate — draw"
        : result.result === "fifty"
          ? "Fifty-move rule — draw"
          : "Insufficient material — draw"
    : thinking
      ? "Engine thinking…"
      : state.turn === side
        ? check
          ? "Your move — you are in check"
          : "Your move"
        : "Engine to move";

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-felt">
      <header className="paper grain shrink-0 border-b-2 border-ink">
        <div className="flex items-center gap-3 px-3 py-2 sm:px-5">
          <button className="btn btn-ghost !px-2.5 !py-1.5 text-[0.65rem]" onClick={onExit}>
            ← Arcade
          </button>
          <div className="min-w-0">
            <div className="smallcaps text-sand">
              {DIFFS.find((d) => d.id === difficulty)?.label} · you are{" "}
              {side === "w" ? "white" : "black"}
            </div>
            <div
              className={`truncate font-display text-base font-bold sm:text-lg ${
                check && !result.over ? "text-vermilion" : ""
              }`}
            >
              {statusLine}
            </div>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="smallcaps hidden text-sand sm:block">
              {record.w}W·{record.l}L·{record.d}D
            </span>
            <button className="icon-btn" onClick={undo} aria-label="Undo move">
              <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
                <path
                  d="M6 2L1 6l5 4V7.5c4 0 7 1 8 4 .5-5-3-7-8-7z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="icon-btn" onClick={onMute} aria-label="Mute">
              <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
                <path d="M0 5h3l4-4v12L3 9H0z" fill="currentColor" />
                {muted ? (
                  <path d="M10 4l5 6M15 4l-5 6" stroke="currentColor" strokeWidth="1.6" fill="none" />
                ) : (
                  <path d="M10 3.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.6" fill="none" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="feltsurface relative flex min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto p-3 lg:flex-row lg:items-start lg:justify-center lg:p-6">
        {/* board */}
        <div
          className={`relative w-full max-w-[min(92vw,68vh)] shrink-0 border-2 border-ink shadow-[8px_8px_0_rgba(0,0,0,.5)] ${
            flash ? "chess-flash" : ""
          }`}
        >
          <div className="grid aspect-square w-full grid-cols-8">
            {order.map((i) => {
              const r = rank(i);
              const c = file(i);
              const dark = (r + c) % 2 === 1;
              const piece = state.board[i];
              const isSel = sel === i;
              const target = legal.find((m) => m.to === i);
              const isLast = last && (last.from === i || last.to === i);
              const isCheckSq = i === kingSq;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => clickSquare(i)}
                  className="relative flex items-center justify-center"
                  style={{
                    background: dark ? "#8a7a5e" : "#e0d4b8",
                    cursor: state.turn === side && !result.over ? "pointer" : "default",
                  }}
                  aria-label={`${square(i)}${piece ? ` ${piece}` : ""}`}
                >
                  {isLast && (
                    <span className="absolute inset-0 bg-ochre/45" aria-hidden="true" />
                  )}
                  {isSel && (
                    <span
                      className="absolute inset-0 border-[3px] border-vermilion"
                      aria-hidden="true"
                    />
                  )}
                  {isCheckSq && (
                    <span
                      className="absolute inset-0 animate-pulse bg-vermilion/55"
                      aria-hidden="true"
                    />
                  )}
                  <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-[clamp(18px,6.4vw,42px)] lg:text-[clamp(18px,4.2vh,42px)]">
                    {piece && (
                      <span
                        style={{
                          color: colorOf(piece) === "w" ? "#f6efe0" : "#161210",
                          textShadow:
                            colorOf(piece) === "w"
                              ? "0 0 1px #1a1512, 1px 1px 0 #1a1512, -1px 1px 0 #1a1512, 1px -1px 0 #1a1512, -1px -1px 0 #1a1512"
                              : "0 1px 0 rgba(231,220,198,.3)",
                        }}
                      >
                        {GLYPH[piece.toLowerCase()]}
                      </span>
                    )}
                  </span>
                  {target && (
                    <span
                      className={`pointer-events-none absolute z-20 ${
                        target.captured || target.ep
                          ? "inset-[6%] rounded-full border-[3px] border-vermilion/85"
                          : "h-[22%] w-[22%] rounded-full bg-vermilion/75"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  {c === (flip ? 7 : 0) && (
                    <span className="pointer-events-none absolute left-0.5 top-0.5 font-mono text-[0.5rem] text-ink/50">
                      {8 - r}
                    </span>
                  )}
                  {r === (flip ? 0 : 7) && (
                    <span className="pointer-events-none absolute bottom-0.5 right-0.5 font-mono text-[0.5rem] text-ink/50">
                      {"abcdefgh"[c]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {promo && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-ink/70">
              <div className="paper border-2 border-ink p-3 text-center">
                <div className="smallcaps mb-2">Promote to</div>
                <div className="flex gap-2">
                  {["q", "r", "b", "n"].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => finishPromo(k)}
                      className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-kraft2 text-3xl hover:bg-ochre/40"
                    >
                      <span style={{ color: side === "w" ? "#f6efe0" : "#161210",
                        textShadow: side === "w" ? "0 0 1px #1a1512, 1px 1px 0 #1a1512, -1px 1px 0 #1a1512" : "none" }}>
                        {GLYPH[k]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* side panel */}
        <div className="w-full max-w-[min(92vw,68vh)] shrink-0 lg:w-64">
          <div className="paper grain border-2 border-ink">
            <div className="flex items-center justify-between border-b-2 border-ink px-3 py-1.5">
              <span className="smallcaps">Move list</span>
              <span className="smallcaps text-sand">{Math.ceil(sans.length / 2)} moves</span>
            </div>
            <ol className="tabular max-h-40 overflow-y-auto px-3 py-2 font-mono text-[0.72rem] lg:max-h-[46vh]">
              {sans.length === 0 && <li className="text-sand">— game start —</li>}
              {Array.from({ length: Math.ceil(sans.length / 2) }).map((_, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-6 text-sand">{i + 1}.</span>
                  <span className="w-16 font-semibold">{sans[i * 2]}</span>
                  <span className="w-16">{sans[i * 2 + 1] ?? ""}</span>
                </li>
              ))}
            </ol>
            <div className="flex gap-2 border-t-2 border-ink p-2">
              <button className="btn btn-ghost flex-1 !px-2 !py-1.5 !text-[0.62rem]" onClick={undo}>
                Undo
              </button>
              <button
                className="btn btn-primary flex-1 !px-2 !py-1.5 !text-[0.62rem]"
                onClick={() => newGame()}
              >
                New game
              </button>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              className="btn btn-ghost flex-1 !px-2 !py-1.5 !text-[0.62rem] !text-kraft !border-kraft/50"
              onClick={() => setStarted(false)}
            >
              Change sides
            </button>
          </div>
        </div>

        {result.over && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink/65 px-4">
            <div className="paper grain w-full max-w-sm border-2 border-ink p-6 text-center shadow-[10px_10px_0_rgba(0,0,0,.55)]">
              <div className="smallcaps text-sand">Game over</div>
              <div className="font-display text-3xl font-black leading-none">
                {result.result === "checkmate"
                  ? result.winner === side
                    ? "YOU WIN"
                    : "ENGINE WINS"
                  : "DRAW"}
              </div>
              <div className="smallcaps mt-2 text-vermilion">{statusLine}</div>
              <div className="mt-5 flex flex-col gap-3">
                <button className="btn btn-primary" onClick={() => newGame()}>
                  Play again
                </button>
                <div className="flex gap-3">
                  <button className="btn btn-ghost flex-1" onClick={() => setStarted(false)}>
                    Setup
                  </button>
                  <button className="btn btn-ghost flex-1" onClick={onExit}>
                    Arcade
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


