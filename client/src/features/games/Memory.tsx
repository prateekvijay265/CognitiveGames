// @ts-nocheck
import { useCallback, useEffect, useState } from "react";

const ICONS = ["●", "▲", "■", "◆", "★", "⬢", "✦", "●"];
const COLORS = [
  "#e0451f",
  "#d99a2b",
  "#2f6b53",
  "#e7dcc6",
  "#2a2320",
  "#a8613c",
  "#5b7f96",
  "#8a7a5e",
];

type CardState = { visible: boolean; matched: boolean; flippedBack: boolean };

export default function Memory({ onExit }: { onExit: () => void }) {
  const [cards, setCards] = useState<{ pairId: number; icon: string; color: string }[]>([]);
  const [states, setStates] = useState<CardState[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);

  const init = useCallback(() => {
    const pairs = ICONS.map((icon, i) => ({
      pairId: i,
      icon,
      color: COLORS[i],
    }));
    const shuffled = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setStates(shuffled.map(() => ({ visible: true, matched: false, flippedBack: true })));
    setSelected([]);
    setMoves(0);
    setDone(false);
    // reveal briefly then hide
    setTimeout(() => {
      setStates(shuffled.map(() => ({ visible: false, matched: false, flippedBack: true })));
    }, 1200);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const flip = useCallback(
    (i: number) => {
      if (done || paused || selected.includes(i) || states[i].matched || states[i].visible) return;
      const newState = [...states];
      newState[i] = { ...newState[i], visible: true, flippedBack: false };
      setStates(newState);
      const newSel = [...selected, i];
      setSelected(newSel);

      if (newSel.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = newSel;
        const match = cards[a].pairId === cards[b].pairId;
        if (match) {
          setTimeout(() => {
            setStates((prev) => {
              const n = [...prev];
              n[a] = { ...n[a], matched: true, visible: false, flippedBack: false };
              n[b] = { ...n[b], matched: true, visible: false, flippedBack: false };
              return n;
            });
            setSelected([]);
          }, 350);
        } else {
          setTimeout(() => {
            setStates((prev) => {
              const n = [...prev];
              n[a] = { ...n[a], visible: false, flippedBack: true };
              n[b] = { ...n[b], visible: false, flippedBack: true };
              return n;
            });
            setSelected([]);
          }, 1000);
        }
      }
    },
    [cards, done, paused, selected, states],
  );

  useEffect(() => {
    if (cards.length > 0 && states.every((s, i) => s.matched || (i >= cards.length ? false : s.matched))) {
      const allMatched = cards.every((_, i) => states[i]?.matched);
      if (allMatched) setDone(true);
    }
  }, [states, cards]);

  return (
    <div className="paper h-[100dvh] w-full overflow-y-auto">
      <div className="grain mx-auto min-h-full max-w-[860px] px-5 pb-14 sm:px-7">
        <div className="flex items-center justify-between border-b-2 border-ink py-3">
          <button className="btn btn-ghost !px-3 !py-1.5 text-[0.68rem]" onClick={onExit}>
            ← Arcade
          </button>
          <span className="smallcaps text-sand">{done ? "Matched" : `Moves ${moves}`}</span>
        </div>

        <div className="pt-7">
          <p className="smallcaps text-vermilion">Memory · flip pairs</p>
          <h1 className="mt-1 font-display text-[clamp(3rem,11vw,6rem)] font-black leading-[0.82] tracking-[-0.035em]">
            MEMORY
            <br />
            PRESS
          </h1>
          <p className="mt-3 max-w-[48ch] text-ink/80">
            Flip two cards. Match the pair. All 8 pairs cleared wins.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
          {cards.map((card, i) => {
            const st = states[i];
            const show = st.visible || st.matched;
            const flippedBack = st.flippedBack && !show;
            return (
              <button
                key={i}
                type="button"
                disabled={done || paused || selected.length >= 2 || st.matched || (st.visible && !st.matched)}
                onClick={() => flip(i)}
                className={`relative aspect-square overflow-hidden border-2 text-[clamp(14px,5vw,30px)] transition ${
                  st.matched ? "border-ink/20 opacity-30" : "border-ink hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-ink)]"
                }`}
                aria-label={show ? `card ${card.pairId}` : "hidden"}
              >
                  <div
                    className="h-full w-full"
                    style={{
                      background: !show ? (flippedBack ? "#1a1512" : "#8a7a5e") : card.color,
                      transition: "transform 0.3s ease",
                    }}
                  >
                  {show && (
                    <span className="flex h-full w-full items-center justify-center text-[clamp(18px,6vw,36px)] text-kraft drop-shadow-[0_1px_0_rgba(26,21,18,.5)]">
                      {card.icon}
                    </span>
                  )}
                  {!show && !flippedBack && (
                    <span className="flex h-full w-full items-center justify-center text-[clamp(8px,2vw,14px)] text-kraft/50 font-mono font-bold tracking-[0.4em]">
                      ?
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {done && (
          <div className="mt-6 text-center">
            <div className="inline-block border-2 border-ink bg-kraft px-5 py-3 shadow-[6px_6px_0_var(--color-ink)]">
              <div className="font-display text-2xl font-black">COMPLETE</div>
              <div className="smallcaps text-vermilion mt-0.5">{moves} moves · all pairs matched</div>
            </div>
            <button className="btn btn-ghost mt-4" onClick={init}>
              Play again
            </button>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button className="btn btn-ghost" onClick={init}>Restart</button>
          <button className="btn btn-ghost" onClick={() => setPaused((p) => !p)}>
            {paused ? "Resume" : "Pause"}
          </button>
        </div>

        <p className="smallcaps mt-8 border-t-2 border-ink pt-3 text-sand">
          Memory · 8 pairs · 16 cards · pairs stay matched
        </p>
      </div>
    </div>
  );
}
