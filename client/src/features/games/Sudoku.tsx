// @ts-nocheck
import { useCallback, useEffect, useState } from "react";
import {
  checkComplete,
  generate,
  newBoard,
} from "../../lib/sudoku";
import type { SudokuBoard } from "../../lib/sudoku";

const DIFFICULTY = [
  { label: "Easy", notes: 45, value: 1 },
  { label: "Medium", notes: 48, value: 2 },
  { label: "Hard", notes: 54, value: 3 },
];

function NumberPad({
  onSelect,
  disabled,
}: {
  onSelect: (n: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(n)}
          className="flex h-9 w-full items-center justify-center border-[3px] border-ink bg-kraft font-mono text-lg font-semibold transition hover:bg-ochre/40 disabled:opacity-30"
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(0)}
        className="col-span-3 flex h-9 items-center justify-center border-[3px] border-ink bg-ink text-kraft text-xs font-semibold uppercase tracking-wider transition hover:bg-ink/80 disabled:opacity-30"
      >
        Clear
      </button>
    </div>
  );
}

export default function Sudoku({ onExit }: { onExit: () => void }) {
  const [board, setBoard] = useState<SudokuBoard>(() => {
    const b = newBoard();
    generate(b, 2);
    return b;
  });
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const [done, setDone] = useState(false);
  const [difficulty, setDifficulty] = useState(2);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("diecut.sudoku.v1");
      if (raw) setBest(JSON.parse(raw).best || 0);
    } catch {
      /* ignore */
    }
  }, []);

  const setValue = useCallback(
    (n: number) => {
      if (!selected) return;
      const [r, c] = selected;
      if (board[r][c].fixed) return;
      const nb = [...board];
      nb[r] = [...nb[r]];
      nb[r][c] = { value: n === 0 ? 0 : n, fixed: false, notes: [] };
      setBoard(nb);
      if (n !== 0 && checkComplete(nb)) {
        setDone(true);
        setBest((prev) => {
          const next = Math.max(prev, 1);
          try {
            localStorage.setItem("diecut.sudoku.v1", JSON.stringify({ best: next }));
          } catch {
            /* ignore */
          }
          return next;
        });
      }
    },
    [board, selected],
  );

  const restart = useCallback(
    (d: number) => {
      const b = newBoard();
      generate(b, d);
      setBoard(b);
      setSelected(null);
      setDone(false);
      setDifficulty(d);
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape") onExit();
      else if (e.key === "r" || e.key === "R") restart(difficulty);
      else if (e.key >= "1" && e.key <= "9" && selected) {
        setValue(parseInt(e.key, 10));
      } else if (e.key === "0" && selected) {
        setValue(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, difficulty, onExit, restart, setValue]);

  return (
    <div className="paper h-[100dvh] w-full overflow-y-auto">
      <div className="grain mx-auto min-h-full max-w-[880px] px-4 pb-14 sm:px-7">
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink py-3">
          <button className="border-[3px] border-ink bg-vermilion text-kraft shadow-[6px_6px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] transition-all font-mono font-bold uppercase tracking-widest px-4 py-2" onClick={onExit}>
            ← Arcade
          </button>
          <span className="font-mono uppercase tracking-widest text-sand">
            {done ? "Complete" : difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard"}
            {best > 0 ? ` · best ${best}` : ""}
          </span>
        </div>

        <div className="pt-7">
          <p className="font-mono uppercase tracking-widest text-vermilion">A number grid · every row, column and box</p>
          <h1 className="mt-1 font-display font-bold uppercase tracking-widest text-4xl leading-[0.85] tracking-[-0.035em]">
            SUDOKU
          </h1>
          <p className="mt-3 max-w-[48ch] text-ink/80">
            Fill the 9×9 grid so each row, column and 3×3 block holds 1–9. Numbers shown at
            start are locked; everything else is yours.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {DIFFICULTY.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => restart(d.value)}
              className={`border-[3px] px-3 py-1.5 font-mono text-[0.75rem] font-semibold uppercase tracking-wider transition ${
                difficulty === d.value ? "border-ink bg-vermilion text-kraft" : "border-ink/40 hover:border-ink"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start gap-5 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
          {/* board */}
          <div className="w-full max-w-[min(92vw,58vh)] lg:w-[58vh] lg:max-w-none">
            <div
              className="grid aspect-square border-3 border-ink bg-kraft shadow-[6px_6px_0_var(--color-ink)]"
              style={{
                gridTemplateColumns: "repeat(9, 1fr)",
                gridTemplateRows: "repeat(9, 1fr)",
              }}
            >
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const selectedHere = selected && selected[0] === r && selected[1] === c;
                  const sameRow = selected ? selected[0] === r : false;
                  const sameCol = selected ? selected[1] === c : false;
                  const sameBlock =
                    selected ?
                      Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
                      Math.floor(selected[1] / 3) === Math.floor(c / 3)
                    : false;
                  const isFixed = cell.fixed;
                  const isDone = done && isFixed;
                  return (
                    <button
                      key={`${r},${c}`}
                      type="button"
                      onClick={() => {
                        if (isFixed) {
                          setSelected([r, c]);
                        } else {
                          setSelected([r, c]);
                        }
                      }}
                      className={`relative flex items-center justify-center border border-ink/15 transition ${
                        selectedHere ? "bg-ochre/50" : sameRow || sameCol ? "bg-ochre/15" : sameBlock ? "bg-ochre/10" : ""
                      } ${isFixed ? "" : "hover:bg-ochre/20"} ${isDone ? "bg-vermilion/10" : ""}`}
                    >
                      {cell.value !== 0 ? (
                        <span
                          className={`font-mono text-[clamp(8px,2.8vw,20px)] font-bold leading-none ${
                            isFixed ? "text-ink" : "text-ink/80"
                          } ${isDone ? "text-vermilion" : ""}`}
                        >
                          {cell.value}
                        </span>
                      ) : cell.notes && cell.notes.length > 0 ? (
                        <span className="grid grid-cols-3 gap-[1px] px-[2px] text-[0.35rem] leading-none text-ink/50">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <span key={i} className="text-center">
                              {cell.notes?.includes(i + 1) ? (i + 1).toString() : ""}
                            </span>
                          ))}
                        </span>
                      ) : null}
                    </button>
                  );
                }),
              )}
            </div>
          </div>

          {/* controls */}
          <div className="w-full max-w-xs lg:max-w-[220px]">
            <div className="bg-kraft2 border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] p-6 paper border-[3px] border-ink p-4">
              <div className="font-mono uppercase tracking-widest">Input</div>
              <NumberPad onSelect={setValue} disabled={done || !selected} />
              <p className="mt-2 text-xs text-ink/60">Select a cell, then press a number. 0 clears.</p>

              <div className="mt-4 border-t border-ink/25 pt-3">
                <div className="font-mono uppercase tracking-widest">Hints</div>
                <div className="mt-2 font-mono text-sm leading-relaxed text-ink/70">
                  <div>Every row, column and 3×3 block must contain 1–9 exactly once.</div>
                  <div className="mt-1">Locked numbers at start are fixed.</div>
                </div>
              </div>

              <button
                className="border-[3px] border-ink bg-vermilion text-kraft shadow-[6px_6px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] transition-all font-mono font-bold uppercase tracking-widest px-4 py-2"
                onClick={() => restart(difficulty)}
              >
                New puzzle
                <span className="border border-kraft/60 px-1 py-0.5 font-mono text-[0.6rem]">R</span>
              </button>
            </div>
          </div>
        </div>

        {done && (
          <div className="flex items-center justify-center">
            <div className="anim-banner border-[3px] border-ink bg-kraft px-5 py-3 text-center shadow-[6px_6px_0_var(--color-ink)]">
              <div className="font-display font-bold uppercase tracking-widest text-4xl leading-none">SOLVED</div>
              <div className="font-mono uppercase tracking-widest mt-1 text-vermilion">grid complete</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
