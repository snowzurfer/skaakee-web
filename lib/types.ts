export enum PieceType {
  Pawn = 0,
  Rook = 1,
  Knight = 2,
  Bishop = 3,
  Queen = 4,
  King = 5,
}

export enum PieceColor {
  Black = 0,
  White = 1,
}

export interface ChessPiece {
  uuid: string;
  type: PieceType;
  color: PieceColor;
  position: [number, number, number];
}

/**
 * Represents the state of the chessboard.
 * A map of UUIDs to chess pieces.
 *
 * It's very simple for now!
 */
export interface Chessboard {
  [uuid: string]: ChessPiece;
}

export interface Message {
  type: string;
}

export interface PieceMovementMessage extends Message {
  type: "pieceMovement";
  position: [number, number, number];
  pieceUuid: string;
}

export interface WelcomeMessage extends Message {
  type: "welcome";
  color: PieceColor;
  chessboard: Chessboard;
}

export interface PlayerConnectionMessage extends Message {
  type: "playerConnected" | "playerDisconnected";
  color: PieceColor;
}
