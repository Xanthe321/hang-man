"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createGame = () => {
    if (!playerName) return;
    setIsLoading(true);
    const newRoomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    router.push(`/game/${newRoomCode}?name=${playerName}&host=true`);
  };

  const joinGame = () => {
    if (!playerName || !roomCode) return;
    setIsLoading(true);
    router.push(`/game/${roomCode}?name=${playerName}&host=false`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Adam asmaca (Metin gotune koyim)</h1>
          <p className="text-gray-400">Arkadaşınla kelime tahmin oyunu oyna</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Oyuncu Adı
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Adınızı girin"
            />
          </div>

          <button
            onClick={createGame}
            disabled={!playerName || isLoading}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed"
          >
            {isLoading ? "Yükleniyor..." : "Yeni Oyun Oluştur"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-400">veya</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Oda Kodu
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Oda kodunu girin"
                maxLength={6}
              />
            </div>
            <button
              onClick={joinGame}
              disabled={!playerName || !roomCode || isLoading}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isLoading ? "Yükleniyor..." : "Oyuna Katıl"}
            </button>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          Oyuna katılmak için bir arkadaşınızdan oda kodu alın veya yeni bir oda
          oluşturun.
        </div>
      </div>
    </main>
  );
}
