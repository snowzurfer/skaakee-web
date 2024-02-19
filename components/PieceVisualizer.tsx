"use client";

import {
  ChessPieceComponent,
  type ChessPieceComponentProps,
} from "@/components/ChessPieceComponent";
import { SmallVisualizer } from "@/components/SmallVisualizer";
import { cn } from "@/lib/utils";
import { Center, Float } from "@react-three/drei";
import { type HTMLAttributes } from "react";

export interface PieceVisualizerProps extends HTMLAttributes<HTMLDivElement> {
  pieceType: ChessPieceComponentProps["pieceType"];
  pieceColor: ChessPieceComponentProps["color"];
}

export function PieceVisualizer({
  className,
  pieceType,
  pieceColor,
  ...props
}: PieceVisualizerProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="absolute inset-0">
        <SmallVisualizer>
          <Float
            scale={0.75}
            floatIntensity={0.2}
            floatingRange={[0.01, 0.05]}
            rotationIntensity={2}
          >
            <Center>
              <ChessPieceComponent
                pieceType={pieceType}
                color={pieceColor}
                rotation={[0, Math.PI / 1.2, 0]}
              />
            </Center>
          </Float>
        </SmallVisualizer>
      </div>
    </div>
  );
}
