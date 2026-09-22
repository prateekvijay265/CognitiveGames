import { useCallback, useEffect, useState } from "react";
import Hub from "./components/Hub";
import type { GameId } from "./components/Hub";
import JigsawGame from "./games/JigsawGame";
import Match3 from "./components/Match3";
import Sudoku from "./components/Sudoku";
import Memory from "./components/Memory";
import Chess from "./components/Chess";
import * as sfx from "./lib/audio";

export default function App() {
  const [game, setGame] = useState<GameId | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);
  const exit = useCallback(() => setGame(null), []);

  const pick = useCallback((g: GameId) => {
    sfx.ensureAudio();
    sfx.start();
    setGame(g);
  }, []);

  if (game === "jigsaw")
    return <JigsawGame onExit={exit} muted={muted} onMute={toggleMute} />;
  if (game === "match3") return <Match3 onExit={exit} muted={muted} onMute={toggleMute} />;
  if (game === "chess") return <Chess onExit={exit} muted={muted} onMute={toggleMute} />;
  if (game === "sudoku") return <Sudoku onExit={exit} />;
  if (game === "memory") return <Memory onExit={exit} />;

  return <Hub onPick={pick} />;
}
