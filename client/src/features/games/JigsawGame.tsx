// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import GameBoard from "./GameBoard";
import { GameOver, SheetPicker, Title } from "./Screens";
import { proceduralSheet, resolveSheets, SHEETS } from "../../lib/art";
import type { Sheet } from "../../lib/art";
import { insertScore, loadScores, qualifies } from "../../lib/scores";
import type { ScoreEntry } from "../../lib/scores";
import * as sfx from "../../lib/audio";

type Level = { cols: number; rows: number; time: number };

const LEVELS: Level[] = [
  { cols: 4, rows: 3, time: 46 },
  { cols: 6, rows: 4, time: 64 },
  { cols: 7, rows: 5, time: 82 },
  { cols: 8, rows: 5, time: 94 },
  { cols: 9, rows: 6, time: 110 },
];

const levelFor = (round: number): Level => LEVELS[Math.min(round - 1, LEVELS.length - 1)];
const PREF_KEY = "diecut.sheet.v1";

export default function JigsawGame({
  onExit,
  muted,
  onMute,
}: {
  onExit: () => void;
  muted: boolean;
  onMute: () => void;
}) {
  const [sheets, setSheets] = useState<Sheet[] | null>(null);
  const [screen, setScreen] = useState<"title" | "pick" | "play" | "over">("title");
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [fits, setFits] = useState(0);
  const [runId, setRunId] = useState(0);
  const [canSign, setCanSign] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const latest = useRef({ score: 0, round: 1 });
  latest.current = { score, round };

  useEffect(() => {
    setScores(loadScores());
    try {
      const saved = localStorage.getItem(PREF_KEY);
      if (saved) setSelectedId(saved);
    } catch {
      /* ignore */
    }
    let alive = true;
    resolveSheets()
      .then((s) => {
        if (!alive) return;
        setSheets(s);
        setSelectedId((prev) => (prev && s.some((x) => x.id === prev) ? prev : s[0]?.id ?? null));
      })
      .catch(() => {
        if (!alive) return;
        const fallback = SHEETS.map((s2, i) => ({ ...s2, src: proceduralSheet(i + 3) }));
        setSheets(fallback);
        setSelectedId((prev) => prev ?? fallback[0]?.id ?? null);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    try {
      localStorage.setItem(PREF_KEY, selectedId);
    } catch {
      /* ignore */
    }
  }, [selectedId]);

  const startRun = useCallback(() => {
    sfx.ensureAudio();
    sfx.start();
    setScore(0);
    setRound(1);
    setFits(0);
    setCanSign(false);
    setRunId((r) => r + 1);
    setScreen("play");
  }, []);

  const handleOver = useCallback(() => {
    setCanSign(qualifies(loadScores(), latest.current.score));
    setScreen("over");
  }, []);

  const sign = useCallback((initials: string) => {
    const entry: ScoreEntry = {
      initials: (initials || "AAA").slice(0, 3).toUpperCase(),
      score: latest.current.score,
      round: latest.current.round,
      date: Date.now(),
    };
    setScores((prev) => insertScore(prev, entry));
    setCanSign(false);
  }, []);

  if (!sheets) {
    return (
      <div className="paper grain flex h-[100dvh] w-full flex-col items-center justify-center gap-4">
        <div className="font-display text-5xl font-black tracking-[-0.03em]">
          DIE<span className="text-vermilion">–</span>CUT
        </div>
        <div className="smallcaps anim-blink text-sand">shuffling the box…</div>
      </div>
    );
  }

  const selected = sheets.find((s) => s.id === selectedId) ?? sheets[0] ?? null;
  const level = levelFor(round);

  if (screen === "play" && selected) {
    return (
      <GameBoard
        key={`${runId}-${round}-${selected.id}`}
        sheet={selected}
        round={round}
        cols={level.cols}
        rows={level.rows}
        roundTime={level.time}
        score={score}
        onDelta={(d) => setScore((s) => s + d)}
        onSnap={() => setFits((n) => n + 1)}
        onAdvance={() => setRound((r) => r + 1)}
        onOver={handleOver}
        onQuit={() => setScreen("title")}
        onRestart={startRun}
        muted={muted}
        onMute={onMute}
      />
    );
  }

  if (screen === "over") {
    return (
      <GameOver
        score={score}
        round={round}
        snapped={fits}
        scores={scores}
        canSign={canSign}
        onSign={sign}
        onAgain={startRun}
        onMenu={() => setScreen("title")}
        onChangeSheet={() => setScreen("pick")}
      />
    );
  }

  if (screen === "pick") {
    return (
      <SheetPicker
        sheets={sheets}
        selectedId={selected?.id ?? null}
        onSelect={setSelectedId}
        onBack={() => setScreen("title")}
        onPlay={startRun}
      />
    );
  }

  return (
    <Title
      sheets={sheets}
      scores={scores}
      selected={selected}
      onPick={() => setScreen("pick")}
      onStart={startRun}
      onExit={onExit}
    />
  );
}
