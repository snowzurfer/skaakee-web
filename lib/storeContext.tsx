import { PropsWithChildren, useRef } from "react";
import { GameContext, createGameStore, type GameStore } from "./store";

interface GameProviderProps extends PropsWithChildren<{ roomId: string }> {}

export function GameProvider({ roomId, children }: GameProviderProps) {
  const storeRef = useRef<GameStore>();
  if (!storeRef.current) {
    storeRef.current = createGameStore(roomId);
  }
  return (
    <GameContext.Provider value={storeRef.current}>
      {children}
    </GameContext.Provider>
  );
}
