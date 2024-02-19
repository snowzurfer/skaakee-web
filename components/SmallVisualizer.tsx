"use client";

import { OrbitControls, Stage } from "@react-three/drei";
import { Canvas, type CanvasProps } from "@react-three/fiber";

export interface SmallVisualizerProps extends CanvasProps {}

export function SmallVisualizer({ children, ...props }: SmallVisualizerProps) {
  return (
    <Canvas shadows {...props}>
      <Stage intensity={0.01}>
        {children}
        <OrbitControls
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.9}
          makeDefault
          enableZoom={false}
          enablePan={false}
        />
      </Stage>
    </Canvas>
  );
}
