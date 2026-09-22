// @ts-nocheck
import { useEffect } from "react";
import type { ReactNode } from "react";
import { LEVELS as M3_LEVELS, loadProgress, unlockedCount } from "../../lib/match3";
import { loadRecord } from "../../lib/chess";
import { loadScores } from "../../lib/scores";

export type GameId = "jigsaw" | "match3" | "chess" | "sudoku" | "memory";

function JigsawIcon() {
  return (
    <svg viewBox="0 0 48 34" className="h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="46" height="32" fill="#e7dcc6" stroke="#1a1512" strokeWidth="2" />
      <path
        d="M24 1v8a3 3 0 100 6v8a3 3 0 110 6v4M1 17h8a3 3 0 106 0h8"
        fill="none"
        stroke="#1a1512"
        strokeWidth="2"
      />
      <rect x="24" y="17" width="23" height="16" fill="#e0451f" opacity=".85" />
    </svg>
  );
}

function CandyIcon() {
  return (
    <svg viewBox="0 0 48 34" className="h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="46" height="32" fill="#e7dcc6" stroke="#1a1512" strokeWidth="2" />
      <circle cx="13" cy="12" r="6" fill="#e0451f" stroke="#1a1512" strokeWidth="2" />
      <rect x="20" y="6" width="12" height="12" fill="#d99a2b" stroke="#1a1512" strokeWidth="2" />
      <path d="M40 6l6 12H34z" fill="#2f6b53" stroke="#1a1512" strokeWidth="2" />
      <circle cx="24" cy="26" r="5" fill="#5b7f96" stroke="#1a1512" strokeWidth="2" />
      <rect x="34" y="21" width="10" height="10" fill="#a8613c" stroke="#1a1512" strokeWidth="2" />
      <circle cx="8" cy="26" r="5" fill="#2a2320" stroke="#1a1512" strokeWidth="2" />
    </svg>
  );
}

function SudokuIcon() {
  return (
    <svg viewBox="0 0 48 34" className="h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="46" height="32" fill="#e7dcc6" stroke="#1a1512" strokeWidth="2" />
      <line x1="17" y1="1" x2="17" y2="33" stroke="#1a1512" strokeWidth="1.5" />
      <line x1="33" y1="1" x2="33" y2="33" stroke="#1a1512" strokeWidth="1.5" />
      <line x1="1" y1="11" x2="47" y2="11" stroke="#1a1512" strokeWidth="1.5" />
      <line x1="1" y1="23" x2="47" y2="23" stroke="#1a1512" strokeWidth="1.5" />
      <text x="6" y="17" fontSize="7" fill="#1a1512">5</text>
      <text x="22" y="9" fontSize="7" fill="#e0451f">3</text>
      <text x="38" y="28" fontSize="7" fill="#e0451f">9</text>
    </svg>
  );
}

function MemoryIcon() {
  return (
    <svg viewBox="0 0 48 34" className="h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="46" height="32" fill="#e7dcc6" stroke="#1a1512" strokeWidth="2" />
      <rect x="4" y="5" width="18" height="12" fill="#e0451f" stroke="#1a1512" strokeWidth="1" />
      <rect x="26" y="5" width="18" height="12" fill="#e0451f" stroke="#1a1512" strokeWidth="1" />
      <rect x="4" y="19" width="18" height="12" fill="#d99a2b" stroke="#1a1512" strokeWidth="1" />
      <rect x="26" y="19" width="18" height="12" fill="#2f6b53" stroke="#1a1512" strokeWidth="1" />
      <text x="7" y="14" fontSize="6" fill="#f3ecdd" fontWeight="bold">●</text>
      <text x="12" y="26" fontSize="6" fill="#f3ecdd" fontWeight="bold">▲</text>
    </svg>
  );
}

function ChessIcon() {
  return (
    <svg viewBox="0 0 48 34" className="h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="46" height="32" fill="#e0d4b8" stroke="#1a1512" strokeWidth="2" />
      {Array.from({ length: 24 }).map((_, i) => {
        const c = i % 6;
        const r = Math.floor(i / 6);
        if ((r + c) % 2 === 1) return null;
        return (
          <rect key={i} x={1 + c * 7.7} y={1 + r * 8} width="7.7" height="8" fill="#8a7a5e" />
        );
      })}
      <text x="24" y="25" textAnchor="middle" fontSize="20" fill="#1a1512">
        ♛
      </text>
    </svg>
  );
}

export default function Hub({ onPick }: { onPick: (g: GameId) => void }) {
  const m3 = loadProgress();
  const stars = M3_LEVELS.reduce((a, l) => a + (m3.stars[l.no] || 0), 0);
  const rec = loadRecord();
  const jig = loadScores();
  const sudokuBest = (() => {
    try {
      const raw = localStorage.getItem("diecut.sudoku.v1");
      if (raw) return JSON.parse(raw).best || 0;
    } catch {
      /* ignore */
    }
    return 0;
  })();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "1") onPick("jigsaw");
      else if (e.key === "2") onPick("match3");
      else if (e.key === "3") onPick("chess");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPick]);

  const cards: {
    id: GameId;
    no: string;
    title: string;
    kicker: string;
    blurb: string;
    stat: string;
    icon: ReactNode;
    accent: string;
  }[] = [
    {
      id: "jigsaw",
      no: "01",
      title: "DIE-CUT",
      kicker: "Jigsaw arcade",
      blurb: "Twenty sheets, real die-cut pieces, a clock and a combo meter.",
      stat: jig.length ? `Best ${jig[0].score.toLocaleString()}` : "No scores yet",
      icon: <JigsawIcon />,
      accent: "var(--color-vermilion)",
    },
    {
      id: "match3",
      no: "02",
      title: "SUGAR PRESS",
      kicker: "Match three · 12 levels",
      blurb: "Swap, cascade, press line candies and colour stars against the order book.",
      stat: `${stars}/${M3_LEVELS.length * 3} stars · level ${unlockedCount(m3)}`,
      icon: <CandyIcon />,
      accent: "var(--color-ochre)",
    },
    {
      id: "chess",
      no: "03",
      title: "THE BOARD",
      kicker: "Chess vs engine",
      blurb: "Full rules with castling, en passant and promotion. Three engine depths.",
      stat: `${rec.w}W · ${rec.l}L · ${rec.d}D`,
      icon: <ChessIcon />,
      accent: "#2f6b53",
    },
    {
      id: "sudoku",
      no: "04",
      title: "SUDOKU",
      kicker: "Number grid · 3 difficulties",
      blurb: "Every row, column and 3×3 box holds 1–9. Locked numbers guide the rest.",
      stat: sudokuBest > 0 ? `Solved · ${sudokuBest} best` : "No solves yet",
      icon: <SudokuIcon />,
      accent: "#5b7f96",
    },
    {
      id: "memory",
      no: "05",
      title: "MEMORY PRESS",
      kicker: "Flip pairs · 16 cards",
      blurb: "Eight pairs hidden under 16 cards. Flip two — match all pairs to win.",
      stat: "8 pairs · 16 cards",
      icon: <MemoryIcon />,
      accent: "#8a7a5e",
    },
  ];

  return (
    <div className="paper h-[100dvh] w-full overflow-y-auto">
      <div className="grain mx-auto min-h-full max-w-[1100px] px-5 pb-16 sm:px-8">
        <div className="flex items-center justify-between border-b-2 border-ink py-3">
          <span className="smallcaps">Paper Arcade · three tables</span>
          <span className="smallcaps text-sand">Press 1 · 2 · 3</span>
        </div>

        <div className="pt-9 sm:pt-12">
          <p className="smallcaps text-vermilion">A cabinet of printed games</p>
          <h1 className="mt-2 font-display text-[clamp(3rem,13vw,7rem)] font-black leading-[0.82] tracking-[-0.035em]">
            PAPER
            <br />
            ARCADE
          </h1>
          <p className="mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink/80">
            Three tables under one lid — a die-cut jigsaw against the clock, a twelve-level sweet
            press, and a full game of chess. Every score stays on this device.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c.id)}
              className="group relative border-2 border-ink bg-kraft/70 p-4 text-left transition hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-ink)]"
            >
              <span
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: c.accent }}
                aria-hidden="true"
              />
              <div className="flex items-start justify-between gap-3 pt-2">
                <span className="smallcaps text-sand">{c.no}</span>
                <span className="h-9 w-12 shrink-0">{c.icon}</span>
              </div>
              <div className="mt-3 font-display text-2xl font-black leading-none">{c.title}</div>
              <div className="smallcaps mt-1 text-vermilion">{c.kicker}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{c.blurb}</p>
              <div className="mt-3 border-t border-ink/25 pt-2 font-mono text-[0.68rem] text-sand">
                {c.stat}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wider">
                Play
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </button>
          ))}
        </div>

        <p className="smallcaps mt-12 border-t-2 border-ink pt-3 text-sand">
          Paper Arcade · all progress stored locally · M mutes any table
        </p>
      </div>
    </div>
  );
}
