import {
  PieceColor,
  type WelcomeMessage,
  type Chessboard,
  type PlayerConnectionMessage,
  type PieceMovementMessage, // Assume this is a type you define for connection/disconnection messages
} from "@/lib/types";
import { initializeChessBoard } from "@/lib/utils";
import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  chessboard: Chessboard = initializeChessBoard();
  whitePlayerId: string | null = null;
  blackPlayerId: string | null = null;

  private disconnectPlayer(playerId: string) {
    const color =
      this.whitePlayerId === playerId ? PieceColor.White : PieceColor.Black;
    if (this.whitePlayerId === playerId) {
      this.whitePlayerId = null;
    } else if (this.blackPlayerId === playerId) {
      this.blackPlayerId = null;
    }

    // Notify all clients about the disconnection
    const disconnectionMessage: PlayerConnectionMessage = {
      type: "playerDisconnected",
      color: color,
    };
    this.room.broadcast(JSON.stringify(disconnectionMessage));
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    let assignedColor = PieceColor.Black; // Default assignment

    if (this.whitePlayerId === null) {
      this.whitePlayerId = conn.id;
      assignedColor = PieceColor.White;
    } else if (this.blackPlayerId === null) {
      this.blackPlayerId = conn.id;
    } else {
      conn.close(4000, "Room is full");
      return;
    }

    // Send welcome message to the newly connected player
    const welcomeMessage: WelcomeMessage = {
      type: "welcome",
      color: assignedColor,
      chessboard: this.chessboard,
    };
    conn.send(JSON.stringify(welcomeMessage));

    // If there's already a player in the room, notify the new player about the existing player
    if (this.whitePlayerId != null && this.blackPlayerId != null) {
      const existingPlayerColor =
        assignedColor === PieceColor.White
          ? PieceColor.Black
          : PieceColor.White;
      const connectionMessage: PlayerConnectionMessage = {
        type: "playerConnected",
        color: existingPlayerColor,
      };
      conn.send(JSON.stringify(connectionMessage));
    }

    // Notify all other clients about the new connection
    const connectionMessage: PlayerConnectionMessage = {
      type: "playerConnected",
      color: assignedColor,
    };
    this.room.broadcast(JSON.stringify(connectionMessage), [conn.id]); // Exclude the new connection
  }

  async onClose(conn: Party.Connection) {
    console.log(
      `Disconnected:
  id: ${conn.id}
  room: ${this.room.id}`
    );

    this.disconnectPlayer(conn.id);
  }

  async onError(connection: Party.Connection, error: Error) {
    console.error(`connection ${connection.id} had an error:`, error);
    this.disconnectPlayer(connection.id);
  }

  onMessage(message: string, sender: Party.Connection) {
    console.log(`connection ${sender.id} sent message: ${message}`);

    const data = JSON.parse(message);
    switch (data.type) {
      case "pieceMovement":
        const movementMessage = data as PieceMovementMessage;
        console.log("received piece movement message", data);
        // Save it to the chessboard
        this.chessboard[movementMessage.pieceUuid].position =
          movementMessage.position;
        // Broadcast the movement to other players
        this.room.broadcast(message, [sender.id]);
        break;
    }
  }
}

Server satisfies Party.Worker;
