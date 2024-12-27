"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  const createGame = () => {
    if (!playerName) return;
    // Rastgele 6 haneli kod oluştur
    const newRoomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    router.push(`/game/${newRoomCode}?name=${playerName}&host=true`);
  };

  const joinGame = () => {
    if (!playerName || !roomCode) return;
    router.push(`/game/${roomCode}?name=${playerName}&host=false`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Hangman Multiplayer</h1>

      <div className="w-full max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Adınız</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Adınızı girin"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={createGame}
            disabled={!playerName}
            className="w-full p-3 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Yeni Oyun Oluştur
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900">veya</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              placeholder="Oda kodunu girin"
            />
            <button
              onClick={joinGame}
              disabled={!playerName || !roomCode}
              className="w-full p-3 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              Oyuna Katıl
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
