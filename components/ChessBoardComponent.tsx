"use client";

import { Gltf } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";

export interface ChessBoardComponentProps extends GroupProps {}

export function ChessBoardComponent(props: ChessBoardComponentProps) {
  return (
    <Gltf
      src={"/assets/board.glb"}
      receiveShadow
      scale={[0.2, 0.2, 0.2]}
      {...props}
    />
  );
}
