import { PieceColor } from "./types";

export const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "127.0.0.1:1999";
export const PROTOCOL = PARTYKIT_HOST.startsWith("127.0.0.1")
  ? "http"
  : "https";
export const PARTYKIT_URL = `${PROTOCOL}://${PARTYKIT_HOST}`;
/**
 * The width of a square on the chess board.
 * In meters.
 */
// export const CHESS_BOARD_SQUARE_LENGTH = 0.06965575;
export const CHESS_BOARD_SQUARE_LENGTH = 0.069586;
/**
 * The length of a side of the chess board.
 * In meters.
 */
export const CHESS_BOARD_SIDE_LENGTH = 8 * CHESS_BOARD_SQUARE_LENGTH;
/**
 * The half height of the chess board.
 * In meters.
 */
export const CHESS_BOARD_HALF_HEIGHT = 0.0285;

export const PIECE_COLOR_TO_CAMERA_INITIAL_POSITION: Record<
  PieceColor,
  [number, number, number]
> = {
  [PieceColor.Black]: [0, 0.6, -0.6],
  [PieceColor.White]: [0, 0.6, 0.6],
};

export const PIECE_COLOR_TO_OPPOSITE_COLOR: Record<PieceColor, PieceColor> = {
  [PieceColor.Black]: PieceColor.White,
  [PieceColor.White]: PieceColor.Black,
};
