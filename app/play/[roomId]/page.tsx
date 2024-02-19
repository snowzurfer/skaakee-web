"use client";

import {
  CHESS_BOARD_HALF_HEIGHT,
  PARTYKIT_HOST,
  PIECE_COLOR_TO_CAMERA_INITIAL_POSITION,
  PIECE_COLOR_TO_OPPOSITE_COLOR,
} from "@/lib/constants";
import { useParams } from "next/navigation";
import usePartySocket from "partysocket/react";
import { Canvas, useThree } from "@react-three/fiber";
import { Grid, Html, OrbitControls, PivotControls } from "@react-three/drei";
import type { PieceMovementMessage, WelcomeMessage } from "@/lib/types";
import {
  calculateCentroidForColor,
  pieceColorToEmoji,
  pieceColorToString,
} from "@/lib/utils";
import { GameProvider } from "@/lib/storeContext";
import { useGameStore } from "@/lib/store";
import { OrbitControls as ThreeOrbitControls } from "three-stdlib";
import { Matrix4, Quaternion, Vector3 } from "three";
import { Suspense, useEffect, useRef } from "react";
import type PartySocket from "partysocket";
import { ChessBoardComponent } from "@/components/ChessBoardComponent";
import { ChessPieceComponent } from "@/components/ChessPieceComponent";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ChessGameScene({ socket }: { socket: PartySocket }) {
  const color = useGameStore((state) => state.color);
  const chessBoard = useGameStore((state) => state.chessboard);
  const selectedPiece = useGameStore((state) => state.selectedPiece);
  const setSelectedPiece = useGameStore((state) => state.setSelectedPiece);
  const setPiecePosition = useGameStore((state) => state.setPiecePosition);
  const controls = useThree((state) => state.controls);
  const camera = useThree((state) => state.camera);
  const isOpponentConnected = useGameStore((state) => state.isOpponenConnected);

  const piecePosCache = useRef(new Vector3());

  // Move the camera to the initial position when the color changes, meaning it's set at the start of the game
  useEffect(() => {
    if (color == null) return;
    camera.position.fromArray(PIECE_COLOR_TO_CAMERA_INITIAL_POSITION[color]);
    camera.lookAt(0, 0, 0);
  }, [color, camera]);

  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight
        position={[0, 1, 0]}
        intensity={Math.PI / 2}
        castShadow
        shadow-mapSize-width={4096} // Increase shadow map resolution for better shadow details
        shadow-mapSize-height={4096}
      />
      <OrbitControls makeDefault />
      <Suspense fallback={null}>
        <ChessBoardComponent position={[0, -CHESS_BOARD_HALF_HEIGHT, 0.004]} />
      </Suspense>
      {color && !isOpponentConnected && (
        <Html
          position={calculateCentroidForColor(
            PIECE_COLOR_TO_OPPOSITE_COLOR[color]
          )}
          center
        >
          <div className="w-fit text-2xl px-3 py-2 bg-white flex-inline text-black text-xs text-nowrap rounded-lg">
            Waiting for opponent...
          </div>
        </Html>
      )}
      {Object.values(chessBoard).map((piece) =>
        piece && selectedPiece != piece.uuid ? (
          <Suspense fallback={null} key={piece.uuid}>
            <ChessPieceComponent
              visible={isOpponentConnected || piece.color === color}
              uuid={piece.uuid}
              position={piece.position}
              pieceType={piece.type}
              color={piece.color}
              // Only install the gestures on the current user's color!
              onClick={
                piece.color === color
                  ? (event) => {
                      event.stopPropagation();

                      const pos = piecePosCache.current;
                      if (selectedPiece) {
                        pos.y = 0;

                        const movementMessage: PieceMovementMessage = {
                          type: "pieceMovement",
                          pieceUuid: selectedPiece,
                          position: pos.toArray() as [number, number, number],
                        };
                        socket.send(JSON.stringify(movementMessage));

                        setPiecePosition(
                          selectedPiece,
                          pos.toArray() as [number, number, number]
                        );
                      }

                      pos.fromArray(piece.position);
                      pos.y = 0.1;

                      const movementMessage: PieceMovementMessage = {
                        type: "pieceMovement",
                        pieceUuid: piece.uuid,
                        position: pos.toArray() as [number, number, number],
                      };
                      socket.send(JSON.stringify(movementMessage));

                      setSelectedPiece(piece.uuid);
                    }
                  : undefined
              }
            />
          </Suspense>
        ) : null
      )}
      {selectedPiece && chessBoard[selectedPiece] && (
        <PivotControls
          fixed
          scale={100}
          activeAxes={[true, false, true]}
          disableRotations
          onDragStart={() => {
            if (!controls) return;
            const orbitControls = controls as ThreeOrbitControls;
            orbitControls.enabled = false;
          }}
          onDrag={(_l, _deltaL, w, _deltaW) => {
            // Get a reference to shorten the name
            const pos = piecePosCache.current;
            // Assign the new position to the piece by reading it from the cached matrix
            w.decompose(pos, new Quaternion(), new Vector3());
            pos.y = 0.1;

            const movementMessage: PieceMovementMessage = {
              type: "pieceMovement",
              pieceUuid: selectedPiece,
              position: pos.toArray() as [number, number, number],
            };
            socket.send(JSON.stringify(movementMessage));

            setPiecePosition(
              selectedPiece,
              pos.toArray() as [number, number, number]
            );
          }}
          onDragEnd={() => {
            if (!controls) return;
            const orbitControls = controls as ThreeOrbitControls;
            orbitControls.enabled = true;
          }}
          matrix={new Matrix4().makeTranslation(
            chessBoard[selectedPiece].position[0],
            0.1,
            chessBoard[selectedPiece].position[2]
          )}
        >
          <Suspense fallback={null}>
            <ChessPieceComponent
              uuid={chessBoard[selectedPiece].uuid}
              pieceType={chessBoard[selectedPiece].type}
              color={chessBoard[selectedPiece].color}
              // No need to check the color here, since the piece is already selected
              // and the onClick event is only installed when the piece is the current user's color
              onClick={(event) => {
                event.stopPropagation();
                const pos = piecePosCache.current;
                pos.y = 0;

                const movementMessage: PieceMovementMessage = {
                  type: "pieceMovement",
                  pieceUuid: selectedPiece,
                  position: pos.toArray() as [number, number, number],
                };
                socket.send(JSON.stringify(movementMessage));

                setPiecePosition(
                  selectedPiece,
                  pos.toArray() as [number, number, number]
                );
                setSelectedPiece(null);
              }}
            />
          </Suspense>
        </PivotControls>
      )}
      <Grid
        infiniteGrid
        fadeDistance={30}
        fadeStrength={4}
        position={[0, -CHESS_BOARD_HALF_HEIGHT, 0]}
      />
    </>
  );
}

function PageWithContext() {
  const roomId = useGameStore((state) => state.roomId);
  const setPiecePosition = useGameStore((state) => state.setPiecePosition);
  const setChessboard = useGameStore((state) => state.setChessboard);
  const color = useGameStore((state) => state.color);
  const setColor = useGameStore((state) => state.setColor);
  const connectionState = useGameStore((state) => state.connectionState);
  const disconnectionReason = useGameStore(
    (state) => state.disconnectionReason
  );
  const setConnectionState = useGameStore((state) => state.setConnectionState);
  const setDisconnectedReason = useGameStore(
    (state) => state.setDisconnectionReason
  );
  const isOpponentConnected = useGameStore((state) => state.isOpponenConnected);
  const setIsOpponentConnected = useGameStore(
    (state) => state.setIsOpponentConnected
  );

  const { toast } = useToast();

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    onOpen(_event) {
      setConnectionState("connected");
    },
    onClose(event) {
      setConnectionState("disconnected");
      setDisconnectedReason(event.reason);
    },
    onMessage(event) {
      const data = JSON.parse(event.data as string);
      switch (data.type) {
        case "welcome":
          const welcomeMessage = data as WelcomeMessage;
          setColor(welcomeMessage.color);
          setChessboard(welcomeMessage.chessboard);
          toast({
            title: "You're connected",
            description: "Welcome to the game!",
            duration: 1500,
          });
          break;
        case "playerConnected":
          setIsOpponentConnected(true);
          toast({
            title: "Opponent connected",
            description: "Your opponent has joined the game",
            duration: 1500,
          });
          break;
        case "playerDisconnected":
          setIsOpponentConnected(false);
          toast({
            title: "Opponent disconnected",
            description: "Your opponent has left the game",
            duration: 1500,
          });
          break;
        case "pieceMovement":
          const movementMessage = data as PieceMovementMessage;
          setPiecePosition(movementMessage.pieceUuid, movementMessage.position);
          break;
      }
    },
    onError(_event) {
      setConnectionState("disconnected");
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center w-full bg-slate-300 dark:bg-slate-800">
      {connectionState === "disconnected" && (
        <div className="grow w-full flex flex-col items-center justify-center gap-y-8">
          <p className="text-3xl">Disconnected: {disconnectionReason}</p>
          <Link href={"/"} passHref>
            <Button size={"lg"} variant={"link"}>
              <span className="text-xl">Home</span>
            </Button>
          </Link>
        </div>
      )}
      {connectionState === "connecting" && (
        <p className="grow w-full flex items-center justify-center text-3xl font-medium">
          Connecting...
        </p>
      )}
      {connectionState === "connected" && (
        <div className="w-full grow relative">
          <div className="absolute inset-0">
            <Canvas shadows>
              <ChessGameScene socket={socket} />
            </Canvas>
          </div>

          <div className="absolute top-0 left-0 p-4">
            <Link href={"/"} passHref>
              <Button variant={"link"}>
                <span className="text-xl">x</span>
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-0 bg-slate-50 dark:bg-slate-950 w-full flex gap-x-8 justify-between items-center p-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"link"}>
                  <span className="text-base">How to play</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="p-8">
                <DialogHeader>
                  <DialogTitle className="text-4xl mb-4">
                    How to play
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col text-2xl gap-y-8">
                  <span>Click on a piece to select it</span>
                  <span>
                    Drag the selected piece to move it to a new position
                  </span>
                  <span>Click on the selected piece again to place it</span>
                </div>
              </DialogContent>
            </Dialog>

            {/* <Button onClick={() => {}} variant={"link"} size={"lg"}>
              <span className="text-base">How to play</span>
            </Button> */}

            <div className="flex gap-x-8">
              {color != null && (
                <p>
                  You are color {pieceColorToString(color)}{" "}
                  {pieceColorToEmoji(color)}
                </p>
              )}{" "}
              <p>Room ID: {roomId}</p>
            </div>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link copied",
                  description:
                    "The link to the room has been copied to your clipboard",
                });
              }}
              variant={"link"}
              size={"lg"}
            >
              <span className="text-base">Copy Room Link</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Play() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <GameProvider roomId={roomId}>
      <PageWithContext />
    </GameProvider>
  );
}
