import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { makePlayRoomRoute } from "@/lib/routes";
import { redirect } from "next/navigation";
import { PieceVisualizer } from "@/components/PieceVisualizer";
import { PieceColor, PieceType } from "@/lib/types";

const randomId = () => Math.random().toString(36).substring(2, 10);

export default function Home() {
  async function joinRoom(formData: FormData) {
    "use server";

    const roomId = formData.get("roomId")?.toString();
    if (!roomId) {
      console.error("No room ID provided");
      return;
    }

    redirect(makePlayRoomRoute(roomId));
  }

  async function createRoom() {
    "use server";

    const roomId = randomId();
    redirect(makePlayRoomRoute(roomId));
  }

  return (
    <main className="flex min-h-screen flex-col items-center w-full px-8 py-2 gap-y-8 dark:bg-slate-900">
      <div className="py-2 w-full flex justify-center items-center gap-x-6">
        <PieceVisualizer
          className="h-72 w-52 flex-none hidden sm:inline"
          pieceColor={PieceColor.White}
          pieceType={PieceType.Knight}
        />
        <p className="text-7xl font-medium text-center py-2 dark:text-slate-200">
          Welcome to Skaakee!
        </p>
        <PieceVisualizer
          className="h-72 w-52 hidden lg:inline"
          pieceColor={PieceColor.Black}
          pieceType={PieceType.Rook}
        />
      </div>
      <div className="grow flex flex-col max-w-screen-lg gap-y-4">
        <div className="py-3">
          <p className="text-5xl dark:text-slate-200">
            Play chess in 3D with your friends!
            <br />
            Just create a new game and share the link, or join an existing game.
          </p>
        </div>

        <div className="py-3">
          <p className="text-5xl dark:text-slate-200">
            Apple Vision Pro + browser cross-play.
          </p>
        </div>

        <div className="grow flex flex items-center justify-center gap-y-4 gap-x-20 flex-wrap">
          <form action={createRoom}>
            <Button size={"frontpage"}>Start new game</Button>
          </form>
          <form action={joinRoom}>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                name="roomId"
                type="text"
                placeholder="Room ID"
                className="text-4xl h-16 dark:bg-slate-700 dark:text-slate-300"
              />
              <Button size={"frontpage"}>Join</Button>
            </div>
          </form>
        </div>
      </div>

      <footer className="w-full p-1 flex flex-col justify-center items-center">
        <span className="dark:text-slate-400">
          By{" "}
          <a
            href="https://github.com/snowzurfer"
            className="text-slate-900 underline-offset-4 hover:underline dark:text-slate-200"
          >
            Alberto Taiuti
          </a>
        </span>
      </footer>
    </main>
  );
}
