import { createStore, useStore } from "zustand";
import { type Chessboard, PieceColor } from "./types";
import { createContext, useContext } from "react";
import { initializeChessBoard } from "./utils";

export type ConnectionState = "disconnected" | "connecting" | "connected";

interface GameState {
  roomId: string;
  connectionState: ConnectionState;
  disconnectionReason: string | null;
  setDisconnectionReason: (reason: string) => void;
  setConnectionState: (state: ConnectionState) => void;
  chessboard: Chessboard;
  color: PieceColor | null;
  setColor: (color: PieceColor) => void;
  setChessboard: (chessboard: Chessboard) => void;
  setPiecePosition: (uuid: string, position: [number, number, number]) => void;
  selectedPiece: string | null;
  setSelectedPiece: (uuid: string | null) => void;
  isOpponenConnected: boolean;
  setIsOpponentConnected: (isConnected: boolean) => void;
}

export type GameStore = ReturnType<typeof createGameStore>;

export function createGameStore(roomId: string) {
  return createStore<GameState>()((set) => ({
    roomId,
    connectionState: "connecting",
    disconnectionReason: null,
    setDisconnectionReason: (reason) => set({ disconnectionReason: reason }),
    color: null,
    setColor: (color) => set({ color }),
    setConnectionState: (connectionState) => set({ connectionState }),
    chessboard: initializeChessBoard(),
    setChessboard: (chessboard) => set({ chessboard }),
    setPiecePosition: (uuid, position) =>
      set((state) => ({
        chessboard: {
          ...state.chessboard,
          [uuid]: {
            ...state.chessboard[uuid],
            position,
          },
        },
      })),
    selectedPiece: null,
    setSelectedPiece: (selectedPiece) => set({ selectedPiece }),
    isOpponenConnected: false,
    setIsOpponentConnected: (isConnected) =>
      set({ isOpponenConnected: isConnected }),
  }));
}

export const GameContext = createContext<GameStore | null>(null);

export function useGameStore<T>(selector: (state: GameState) => T): T {
  const store = useContext(GameContext);
  if (!store) throw new Error("Missing GameContext.Provider in the tree");
  return useStore(store, selector);
}
