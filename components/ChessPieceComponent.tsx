"use client";

import { type ChessPiece, PieceType, PieceColor } from "@/lib/types";
import { Gltf } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";

const CHESS_PIECE_BLACK_TO_MODEL_PATH: Record<PieceType, string> = {
  [PieceType.Pawn]: "/assets/pawn_black.glb",
  [PieceType.Rook]: "/assets/rook_black.glb",
  [PieceType.Knight]: "/assets/knight_black.glb",
  [PieceType.Bishop]: "/assets/bishop_black.glb",
  [PieceType.Queen]: "/assets/queen_black.glb",
  [PieceType.King]: "/assets/king_black.glb",
};

const CHESS_PIECE_WHITE_TO_MODEL_PATH: Record<PieceType, string> = {
  [PieceType.Pawn]: "/assets/pawn_white.glb",
  [PieceType.Rook]: "/assets/rook_white.glb",
  [PieceType.Knight]: "/assets/knight_white.glb",
  [PieceType.Bishop]: "/assets/bishop_white.glb",
  [PieceType.Queen]: "/assets/queen_white.glb",
  [PieceType.King]: "/assets/king_white.glb",
};

const PIECE_COLOR_TO_COLLECTION: Record<
  PieceColor,
  typeof CHESS_PIECE_WHITE_TO_MODEL_PATH
> = {
  [PieceColor.Black]: CHESS_PIECE_BLACK_TO_MODEL_PATH,
  [PieceColor.White]: CHESS_PIECE_WHITE_TO_MODEL_PATH,
};

export interface ChessPieceComponentProps
  extends Omit<ChessPiece, "position" | "uuid" | "type">,
    GroupProps {
  pieceType: ChessPiece["type"];
}

export function ChessPieceComponent({
  uuid,
  color,
  pieceType,
  ...rest
}: ChessPieceComponentProps) {
  return (
    <group {...rest}>
      <Gltf
        src={PIECE_COLOR_TO_COLLECTION[color][pieceType]}
        castShadow
        receiveShadow
        scale={[0.2, 0.2, 0.2]}
      />
    </group>
  );
}
