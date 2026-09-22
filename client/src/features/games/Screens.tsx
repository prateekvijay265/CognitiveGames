// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { buildPuzzle, makeRng } from "../../lib/jigsaw";
import type { Sheet } from "../../lib/art";
import type { ScoreEntry } from "../../lib/scores";

const LOGO = buildPuzzle(1, 1, 120, 120, makeRng(7)).pieces[0];

function PieceGlyph({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox={`0 0 ${LOGO.w} ${LOGO.h}`}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d={LOGO.d} fill="currentColor" />
      <path d={LOGO.d} fill="none" stroke="#1a1512" strokeWidth="3" />
    </svg>
  );
}

export function Ledger({
  scores,
  compact = false,
}: {
  scores: ScoreEntry[];
  compact?: boolean;
}) {
  return (
    <div className="border-2 border-ink bg-kraft/60">
      <div className="flex items-center justify-between border-b-2 border-ink px-3 py-2">
        <span className="smallcaps">High-score ledger</span>
        <span className="smallcaps text-sand">{scores.length ? `Top ${scores.length}` : "Empty"}</span>
      </div>
      {scores.length === 0 ? (
        <div className="px-3 py-7 text-center">
          <div className="smallcaps anim-blink text-sand">— no scores on file —</div>
        </div>
      ) : (
        <table className="tabular w-full border-collapse font-mono text-sm">
          <thead>
            <tr className="smallcaps text-sand">
              <th className="px-3 py-1.5 text-left font-semibold">#</th>
              <th className="px-1 py-1.5 text-left font-semibold">Name</th>
              <th className="px-1 py-1.5 text-right font-semibold">Score</th>
              <th className="px-1 py-1.5 text-right font-semibold">Round</th>
              {!compact && (
                <th className="px-3 py-1.5 text-right font-semibold">Cut</th>
              )}
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr
                key={`${s.date}-${i}`}
                className={`border-t border-ink/25 ${i === 0 ? "bg-vermilion/10" : ""}`}
              >
                <td className="px-3 py-1.5 text-sand">{String(i + 1).padStart(2, "0")}</td>
                <td className="px-1 py-1.5 font-semibold tracking-[0.24em]">{s.initials}</td>
                <td className="px-1 py-1.5 text-right font-semibold">{s.score.toLocaleString()}</td>
                <td className="px-1 py-1.5 text-right">{s.round}</td>
                {!compact && (
                  <td className="px-3 py-1.5 text-right text-sand">
                    {new Date(s.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                    })}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const CONTROLS: [string, string][] = [
  ["Grab a piece", "DRAG · TOUCH"],
  ["Select next piece", "TAB · Q / E"],
  ["Nudge selected", "ARROWS · SHIFT"],
  ["Magnetise home", "SPACE · ENTER"],
  ["Pause / restart", "P · ESC / R"],
  ["Mute the table", "M"],
];

export function Title({
  sheets,
  scores,
  selected,
  onPick,
  onStart,
  onExit,
}: {
  sheets: Sheet[] | null;
  scores: ScoreEntry[];
  selected: Sheet | null;
  onPick: () => void;
  onStart: () => void;
  onExit?: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
        e.preventDefault();
        onStart();
      } else if ((e.key === "c" || e.key === "C") && !e.repeat) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        onPick();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onStart, onPick]);

  const art = selected ?? sheets?.[0] ?? null;

  return (
    <div className="paper h-full w-full overflow-y-auto">
      <div className="grain mx-auto min-h-full max-w-[1180px] px-5 pb-16 sm:px-8">
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink py-3">
          {onExit ? (
            <button className="btn btn-ghost !px-3 !py-1.5 text-[0.68rem]" onClick={onExit}>
              ← Arcade
            </button>
          ) : (
            <span className="smallcaps">Die-Cut · tabletop arcade</span>
          )}
          <span className="smallcaps text-sand">
            Series one · {sheets?.length ?? 0} sheets
          </span>
        </div>

        <div className="grid gap-9 pt-8 lg:grid-cols-12 lg:gap-12 lg:pt-12">
          {/* ---- box lid ---- */}
          <figure className="relative lg:col-span-5">
            <div className="relative border-2 border-ink bg-kraft2 p-3 shadow-[9px_9px_0_var(--color-ink)]">
              <div className="relative aspect-[3/2] overflow-hidden border border-ink/70 bg-felt">
                {art ? (
                  <img
                    src={art.src}
                    alt={`${art.title} — the sheet inside the box`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="smallcaps anim-blink text-kraft">shuffling the box…</span>
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-multiply"
                  style={{
                    background:
                      "linear-gradient(155deg, rgba(224,69,31,.14), rgba(20,52,43,.22) 60%, rgba(26,21,18,.35))",
                  }}
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <span className="smallcaps text-sand">No. {art?.no ?? "01"}</span>
                <span className="font-display text-lg font-bold">{art?.title ?? "Loading"}</span>
              </figcaption>
              <div className="mt-1 flex justify-between border-t border-ink/30 pt-1">
                <span className="smallcaps text-ink/70">12 pieces</span>
                <span className="smallcaps text-ink/70">46 sec</span>
                <span className="smallcaps text-ink/70">×5 max combo</span>
              </div>
            </div>
            {/* registration ticks */}
            <span className="absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-vermilion" />
            <span className="absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 border-vermilion" />
          </figure>

          {/* ---- masthead ---- */}
          <div className="lg:col-span-7">
            <p className="smallcaps text-vermilion">A jigsaw arcade in one sitting</p>
            <h1
              aria-label="DIE-CUT"
              className="mt-2 flex flex-wrap items-center gap-x-[0.02em] font-display text-[clamp(3.4rem,12vw,7.5rem)] font-black leading-[0.82] tracking-[-0.035em]"
            >
              <span aria-hidden="true">DIE</span>
              <span
                aria-hidden="true"
                className="inline-flex items-center"
                style={{ width: "0.62em", height: "0.62em" }}
              >
                <span className="anim-hyphen block h-full w-full text-vermilion">
                  <PieceGlyph className="h-full w-full" />
                </span>
              </span>
              <span aria-hidden="true">CUT</span>
            </h1>
            <p className="mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink/80">
              Loose pieces are dealt onto the felt around an empty die-line. Pull one home before
              the clock runs out — the fit gives you a magnet, the magnet gives you a combo, and
              the sheet gives you the next cut.
            </p>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="smallcaps mb-2 border-b-2 border-ink pb-1">Table rules</div>
                <dl className="space-y-1.5 font-mono text-[0.74rem]">
                  {CONTROLS.map(([a, b]) => (
                    <div key={a} className="flex items-baseline gap-2">
                      <dt className="text-ink/80">{a}</dt>
                      <dd className="flex-1 border-b border-dotted border-ink/40" />
                      <dd className="whitespace-nowrap font-semibold">{b}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <div className="smallcaps mb-2 border-b-2 border-ink pb-1">Scoring</div>
                <ul className="space-y-1.5 font-mono text-[0.74rem] text-ink/80">
                  <li>100 pts per fit, × combo to ×5</li>
                  <li>Combo holds for 4 seconds</li>
                  <li>Every fit returns 1.2 sec</li>
                  <li>Leftover time × 20 on clear</li>
                  <li>Each sheet cuts bigger: 12 → 54</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="btn btn-primary text-[0.85rem]" onClick={onStart}>
                Open the box
                <span className="border border-kraft/60 px-1.5 py-0.5 font-mono text-[0.65rem]">
                  SPACE
                </span>
              </button>
              <button className="btn btn-ghost text-[0.85rem]" onClick={onPick}>
                Choose sheet
                <span className="border border-ink/50 px-1.5 py-0.5 font-mono text-[0.65rem]">
                  C
                </span>
              </button>
              <span className="smallcaps text-sand">
                Best on this machine: {scores[0]?.score.toLocaleString() ?? "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Ledger scores={scores} />
          </div>
          <div className="lg:col-span-7 border-2 border-ink bg-kraft/60 p-4">
            <div className="flex items-center justify-between border-b-2 border-ink pb-1">
              <span className="smallcaps">In the box · {sheets?.length ?? 0} sheets</span>
              <button
                type="button"
                className="smallcaps text-vermilion underline-offset-2 hover:underline"
                onClick={onPick}
              >
                Browse all →
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {sheets?.slice(0, 10).map((s) => {
                const active = art?.id === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={onPick}
                    className={`group relative overflow-hidden border-2 text-left transition ${
                      active
                        ? "border-vermilion shadow-[3px_3px_0_var(--color-ink)]"
                        : "border-ink/50 hover:border-ink"
                    }`}
                    aria-label={`Open picker on ${s.title}`}
                  >
                    <span className="block aspect-[3/2] bg-felt">
                      <img
                        src={s.src}
                        alt=""
                        className="h-full w-full object-cover transition group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    </span>
                    <span className="block truncate bg-kraft px-1.5 py-1 font-mono text-[0.62rem] tracking-wide">
                      {s.no} · {s.title}
                    </span>
                    {active && (
                      <span className="absolute left-1 top-1 bg-vermilion px-1 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-wider text-kraft">
                        selected
                      </span>
                    )}
                  </button>
                );
              }) ?? (
                <div className="col-span-full smallcaps anim-blink text-sand">
                  shuffling the box…
                </div>
              )}
            </div>
            {(sheets?.length ?? 0) > 10 && (
              <p className="smallcaps mt-3 text-sand">
                +{(sheets?.length ?? 0) - 10} more in the full catalogue
              </p>
            )}
          </div>
        </div>

        <p className="mt-10 border-t-2 border-ink pt-3 smallcaps text-sand">
          Die-Cut · die-cut paths generated per sheet · ledger stored on this device only
        </p>
      </div>
    </div>
  );
}

export function SheetPicker({
  sheets,
  selectedId,
  onSelect,
  onBack,
  onPlay,
}: {
  sheets: Sheet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onPlay: () => void;
}) {
  const [focus, setFocus] = useState(() => {
    const i = sheets.findIndex((s) => s.id === selectedId);
    return i >= 0 ? i : 0;
  });
  const [filter, setFilter] = useState("All");
  const tags = ["All", ...Array.from(new Set(sheets.map((s) => s.tag || "Other")))];

  const visible =
    filter === "All" ? sheets : sheets.filter((s) => (s.tag || "Other") === filter);

  useEffect(() => {
    // keep focus index inside the currently visible list
    if (focus >= visible.length) setFocus(Math.max(0, visible.length - 1));
  }, [filter, visible.length, focus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onBack();
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const s = visible[focus];
        if (s) {
          onSelect(s.id);
          onPlay();
        }
        return;
      }
      const cols =
        typeof window !== "undefined" && window.innerWidth >= 1024
          ? 5
          : window.innerWidth >= 640
            ? 4
            : 2;
      let next = focus;
      if (e.key === "ArrowRight") next = Math.min(visible.length - 1, focus + 1);
      else if (e.key === "ArrowLeft") next = Math.max(0, focus - 1);
      else if (e.key === "ArrowDown") next = Math.min(visible.length - 1, focus + cols);
      else if (e.key === "ArrowUp") next = Math.max(0, focus - cols);
      else return;
      e.preventDefault();
      setFocus(next);
      const s = visible[next];
      if (s) onSelect(s.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, visible, onBack, onPlay, onSelect]);

  const current = sheets.find((s) => s.id === selectedId) ?? visible[focus] ?? sheets[0];

  return (
    <div className="paper h-[100dvh] w-full overflow-hidden">
      <div className="grain mx-auto flex h-full max-w-[1180px] flex-col px-4 sm:px-6">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-ink py-3">
          <div className="min-w-0">
            <div className="smallcaps text-sand">Sheet catalogue</div>
            <div className="truncate font-display text-2xl font-black leading-none sm:text-3xl">
              Pick a picture
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" className="btn btn-ghost !px-3 !py-2 text-[0.7rem]" onClick={onBack}>
              Back
              <span className="border border-ink/40 px-1 font-mono text-[0.6rem]">ESC</span>
            </button>
            <button
              type="button"
              className="btn btn-primary !px-3 !py-2 text-[0.7rem]"
              onClick={onPlay}
              disabled={!current}
            >
              Play
              <span className="border border-kraft/50 px-1 font-mono text-[0.6rem]">⏎</span>
            </button>
          </div>
        </div>

        {/* preview strip */}
        {current && (
          <div className="mt-3 flex shrink-0 gap-3 border-2 border-ink bg-kraft2/40 p-2 sm:p-3">
            <div className="relative h-20 w-28 shrink-0 overflow-hidden border border-ink sm:h-28 sm:w-44">
              <img src={current.src} alt="" className="h-full w-full object-cover" />
              <span className="absolute left-1 top-1 bg-vermilion px-1 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-wider text-kraft">
                ready
              </span>
            </div>
            <div className="min-w-0 flex-1 self-center">
              <div className="smallcaps text-sand">
                No. {current.no}
                {current.tag ? ` · ${current.tag}` : ""}
              </div>
              <div className="truncate font-display text-xl font-bold sm:text-2xl">
                {current.title}
              </div>
              <p className="mt-1 hidden text-sm text-ink/70 sm:block">
                This sheet stays locked for the whole run. Clear it to keep the same picture on a
                harder cut.
              </p>
            </div>
          </div>
        )}

        {/* tag filters */}
        <div className="mt-3 flex shrink-0 gap-1.5 overflow-x-auto pb-1">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setFilter(t);
                setFocus(0);
              }}
              className={`shrink-0 border-2 px-2.5 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-wider transition ${
                filter === t
                  ? "border-ink bg-vermilion text-kraft"
                  : "border-ink/40 bg-transparent text-ink hover:border-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* grid */}
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto pb-6">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {visible.map((s, i) => {
              const active = selectedId === s.id;
              const focused = i === focus;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setFocus(i);
                    onSelect(s.id);
                  }}
                  onDoubleClick={() => {
                    onSelect(s.id);
                    onPlay();
                  }}
                  className={`group relative overflow-hidden border-2 text-left transition ${
                    active
                      ? "border-vermilion shadow-[4px_4px_0_var(--color-ink)]"
                      : focused
                        ? "border-ink shadow-[3px_3px_0_var(--color-ink)]"
                        : "border-ink/35 hover:border-ink hover:shadow-[3px_3px_0_var(--color-ink)]"
                  }`}
                  aria-pressed={active}
                  aria-label={`${s.title}, sheet ${s.no}`}
                >
                  <span className="block aspect-[3/2] overflow-hidden bg-felt">
                    <img
                      src={s.src}
                      alt=""
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.05]"
                      loading="lazy"
                    />
                  </span>
                  <span className="flex items-baseline justify-between gap-1 border-t border-ink/30 bg-kraft px-2 py-1.5">
                    <span className="truncate font-display text-sm font-bold leading-tight">
                      {s.title}
                    </span>
                    <span className="shrink-0 font-mono text-[0.6rem] text-sand">{s.no}</span>
                  </span>
                  {s.tag && (
                    <span className="absolute left-1.5 top-1.5 border border-ink/40 bg-kraft/90 px-1 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider text-ink">
                      {s.tag}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-10 right-1.5 flex h-6 w-6 items-center justify-center border-2 border-ink bg-vermilion text-kraft">
                      <svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true">
                        <path
                          d="M1 5l3.5 3.5L11 1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {visible.length === 0 && (
            <div className="py-16 text-center smallcaps text-sand">No sheets in this drawer</div>
          )}
        </div>

        <p className="smallcaps shrink-0 border-t-2 border-ink py-2 text-sand">
          Arrows move · Enter plays · double-tap a card · Esc returns
        </p>
      </div>
    </div>
  );
}

export function GameOver({
  score,
  round,
  snapped,
  scores,
  canSign,
  onSign,
  onAgain,
  onMenu,
  onChangeSheet,
}: {
  score: number;
  round: number;
  snapped: number;
  scores: ScoreEntry[];
  canSign: boolean;
  onSign: (initials: string) => void;
  onAgain: () => void;
  onMenu: () => void;
  onChangeSheet: () => void;
}) {
  const [initials, setInitials] = useState("");
  const [signed, setSigned] = useState(false);
  const signedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (canSign) inputRef.current?.focus();
  }, [canSign]);

  const sign = () => {
    if (!canSign || signedRef.current) return;
    signedRef.current = true;
    onSign(initials || "AAA");
    setSigned(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT") return; // the form submits on Enter
      if (e.key === "Enter") {
        e.preventDefault();
        onAgain();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onMenu();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAgain, onMenu]);

  return (
    <div className="feltsurface h-full w-full overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-[860px] flex-col justify-center px-4 py-8">
        <div className="paper grain relative border-2 border-ink shadow-[12px_12px_0_rgba(0,0,0,.55)]">
          <div className="flex items-center justify-between border-b-2 border-ink bg-vermilion px-4 py-2 text-kraft">
            <span className="smallcaps">Time up</span>
            <span className="smallcaps">Sheet {String(round).padStart(2, "0")}</span>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
            <div>
              <div className="smallcaps text-sand">Final score</div>
              <div className="tabular font-mono text-[clamp(2.8rem,13vw,4.6rem)] font-semibold leading-none">
                {score.toLocaleString()}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="border-2 border-ink px-3 py-2">
                  <div className="smallcaps text-sand">Sheets</div>
                  <div className="tabular font-mono text-xl font-semibold">{round}</div>
                </div>
                <div className="border-2 border-ink px-3 py-2">
                  <div className="smallcaps text-sand">Fits</div>
                  <div className="tabular font-mono text-xl font-semibold">{snapped}</div>
                </div>
              </div>
            </div>

            <div>
              {canSign && !signed ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sign();
                  }}
                >
                  <div className="smallcaps text-vermilion">New high score — sign the ledger</div>
                  <div className="mt-2 flex gap-2">
                    <input
                      ref={inputRef}
                      value={initials}
                      maxLength={3}
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(e) =>
                        setInitials(
                          e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3),
                        )
                      }
                      placeholder="AAA"
                      aria-label="Your initials"
                      className="tabular w-36 border-2 border-ink bg-kraft2/70 px-3 py-2 text-center font-mono text-2xl tracking-[0.4em] outline-none placeholder:text-sand/60"
                    />
                    <button className="btn btn-primary flex-1" type="submit">
                      Sign
                    </button>
                  </div>
                  <p className="smallcaps mt-2 text-sand">Three characters · then ⏎</p>
                </form>
              ) : (
                <div>
                  <div className="smallcaps text-sand">
                    {signed ? "Signed" : "Ledger standing"}
                  </div>
                  <p className="mt-1 font-display text-2xl font-bold leading-tight">
                    {signed
                      ? "Your name is in the book."
                      : "Not this time — the box stays shut."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 pb-6 sm:px-7">
            <Ledger scores={scores} compact />
          </div>

          <div className="flex flex-col gap-3 border-t-2 border-ink p-5 sm:flex-row sm:flex-wrap sm:px-7">
            <button className="btn btn-primary flex-1" onClick={onAgain}>
              Play again
              <span className="border border-kraft/60 px-1.5 py-0.5 font-mono text-[0.65rem]">
                ENTER
              </span>
            </button>
            <button className="btn btn-ghost flex-1" onClick={onChangeSheet}>
              Change sheet
            </button>
            <button className="btn btn-ghost flex-1" onClick={onMenu}>
              Menu
              <span className="border border-ink/50 px-1.5 py-0.5 font-mono text-[0.65rem]">
                ESC
              </span>
            </button>
          </div>
        </div>
        <p className="smallcaps mt-4 text-center text-kraft/75">
          Drag to fit · TAB selects · SPACE magnetises · P pauses
        </p>
      </div>
    </div>
  );
}
