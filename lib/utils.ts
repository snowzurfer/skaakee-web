import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  type Chessboard,
  PieceColor,
  PieceType,
  type ChessPiece,
} from "./types";
import { v4 as uuidv4 } from "uuid";
import {
  CHESS_BOARD_SIDE_LENGTH,
  CHESS_BOARD_SQUARE_LENGTH,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pieceColorToString(color: PieceColor): string {
  switch (color) {
    case PieceColor.Black:
      return "black";
    case PieceColor.White:
      return "white";
  }
}

export function pieceColorToEmoji(color: PieceColor): string {
  switch (color) {
    case PieceColor.Black:
      return "🖤";
    case PieceColor.White:
      return "🤍";
  }
}

function createChessPiece(
  type: PieceType,
  color: PieceColor,
  x: number,
  z: number
): ChessPiece {
  return {
    uuid: uuidv4(), // Generate a new UUID for the piece
    type,
    color,
    position: [
      -CHESS_BOARD_SIDE_LENGTH / 2 +
        x * CHESS_BOARD_SQUARE_LENGTH +
        CHESS_BOARD_SQUARE_LENGTH / 2,
      0,
      -CHESS_BOARD_SIDE_LENGTH / 2 +
        z * CHESS_BOARD_SQUARE_LENGTH +
        CHESS_BOARD_SQUARE_LENGTH / 2,
    ],
  };
}

export function initializeChessBoard(): Chessboard {
  const board: Chessboard = {};

  // Function to initialize a row of pieces
  const initRow = (pieces: PieceType[], color: PieceColor, z: number) =>
    pieces.forEach((type, x) => {
      const piece = createChessPiece(type, color, x, z);
      board[piece.uuid] = piece;
    });

  // Setup Black Pieces
  initRow(
    [
      PieceType.Rook,
      PieceType.Knight,
      PieceType.Bishop,
      PieceType.Queen,
      PieceType.King,
      PieceType.Bishop,
      PieceType.Knight,
      PieceType.Rook,
    ],
    PieceColor.Black,
    0
  );
  initRow(Array(8).fill(PieceType.Pawn), PieceColor.Black, 1);

  // Setup White Pieces
  initRow(Array(8).fill(PieceType.Pawn), PieceColor.White, 6);
  initRow(
    [
      PieceType.Rook,
      PieceType.Knight,
      PieceType.Bishop,
      PieceType.Queen,
      PieceType.King,
      PieceType.Bishop,
      PieceType.Knight,
      PieceType.Rook,
    ],
    PieceColor.White,
    7
  );

  return board;
}

export function calculateCentroidForColor(
  color: PieceColor
): [number, number, number] {
  // The x position of the centroid is at the middle of the board
  const xCentroid = 0; // Board is centered at x = 0

  // The y position for the centroid, assuming it's for a 3D banner, might be slightly above the board
  const yCentroid = 0.1; // Adjust this value based on the desired height above the board

  // Calculate the z position of the centroid based on the color
  const zCentroid =
    color === PieceColor.White
      ? -CHESS_BOARD_SIDE_LENGTH / 2 + 6.5 * CHESS_BOARD_SQUARE_LENGTH // Midpoint of rows 6 and 7
      : -CHESS_BOARD_SIDE_LENGTH / 2 + 0.5 * CHESS_BOARD_SQUARE_LENGTH; // Midpoint of rows 0 and 1

  console.log("Centroid for color", color, "is", [
    xCentroid,
    yCentroid,
    zCentroid,
  ]);

  return [xCentroid, yCentroid, zCentroid];
}
