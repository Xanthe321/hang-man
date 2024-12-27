"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useParams, useSearchParams } from "next/navigation";
import Hangman from "@/components/Hangman";

interface GameState {
  currentPlayer: string;
  word: string;
  maskedWord: string;
  guessedLetters: string[];
  remainingGuesses: number;
  scores: Record<string, number>;
  round: number;
  category: string;
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002";

export default function GameRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomCode = params.roomCode as string;
  const playerName = searchParams.get("name");
  const isHost = searchParams.get("host") === "true";

  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Bağlanıyor...");
  const [gameOver, setGameOver] = useState<{
    scores: Record<string, number>;
    winner: string;
  } | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      query: {
        roomCode,
        playerName,
        isHost,
      },
      transports: ["websocket", "polling"],
      withCredentials: true,
      forceNew: true,
    });

    newSocket.on("connect", () => {
      console.log("Sunucuya bağlandı");
      setConnectionStatus("Bağlandı");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Bağlantı hatası:", error);
      setConnectionStatus("Bağlantı hatası");
    });

    newSocket.on("gameState", (state: GameState) => {
      console.log("Oyun durumu güncellendi:", state);
      setGameState(state);
      setGameOver(null);
    });

    newSocket.on("players", (playerList: string[]) => {
      console.log("Oyuncu listesi güncellendi:", playerList);
      setPlayers(playerList);
    });

    newSocket.on("gameOver", (result) => {
      setGameOver(result);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomCode, playerName, isHost]);

  const handleRestart = () => {
    if (socket) {
      socket.emit("restartGame", { roomCode });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      {/* Loading State */}
      {(!gameState || !socket) && (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="text-2xl font-bold text-center mb-6">
              Oyuncular Bekleniyor
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Oda Kodu:</div>
                <div className="text-xl font-mono">{roomCode}</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">
                  Oyuncular ({players.length}/2):
                </div>
                {players.map((player, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div
                      className={`${
                        player === playerName ? "text-yellow-300" : "text-white"
                      }`}
                    >
                      {player} {player === playerName ? "(Sen)" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game UI */}
      {gameState && socket && (
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="text-gray-400 text-sm mb-1">Oda Kodu</div>
              <div className="text-lg font-mono">{roomCode}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl shadow-lg text-center">
              <div className="text-gray-400 text-sm mb-1">Round</div>
              <div className="text-2xl font-bold">{gameState.round}/5</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="text-gray-400 text-sm mb-1">Kategori</div>
              <div className="text-lg">{gameState.category}</div>
            </div>
          </div>

          {/* Game Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side */}
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="text-center mb-4">
                  <div className="text-gray-400 mb-2">Sıra</div>
                  <div
                    className={`text-xl font-bold ${
                      gameState.currentPlayer === playerName
                        ? "text-yellow-300"
                        : "text-white"
                    }`}
                  >
                    {gameState.currentPlayer}{" "}
                    {gameState.currentPlayer === playerName ? "(Sen)" : ""}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(gameState.scores).map(([player, score]) => (
                    <div
                      key={player}
                      className="bg-gray-700 p-3 rounded-lg text-center"
                    >
                      <div className="text-sm text-gray-400 mb-1">{player}</div>
                      <div className="text-2xl font-bold">{score}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex justify-center">
                <Hangman mistakes={6 - gameState.remainingGuesses} />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <div className="text-4xl font-mono tracking-[1em] leading-relaxed break-all">
                  {gameState.maskedWord.split("").join(" ")}
                </div>
                <div className="mt-4 text-gray-400">
                  Kalan Hak: {gameState.remainingGuesses}
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="grid grid-cols-7 gap-2">
                  {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZİŞĞÜÇÖ").map(
                    (letter) => (
                      <button
                        key={letter}
                        onClick={() =>
                          socket.emit("guess", { letter, roomCode })
                        }
                        disabled={
                          gameState.currentPlayer !== playerName ||
                          gameState.guessedLetters.includes(letter)
                        }
                        className={`
                        aspect-square rounded-lg text-lg font-bold transition-all
                        ${
                          gameState.guessedLetters.includes(letter)
                            ? "bg-gray-700 text-gray-500"
                            : gameState.currentPlayer === playerName
                            ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
                            : "bg-gray-700 text-gray-400"
                        }
                        disabled:cursor-not-allowed
                      `}
                      >
                        {letter}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <h2 className="text-3xl font-bold text-center mb-6">Oyun Bitti!</h2>
            <div className="bg-gray-700 p-4 rounded-xl mb-6">
              <div className="text-center mb-4">
                <div className="text-gray-400 text-sm">Kazanan</div>
                <div className="text-2xl font-bold text-yellow-300">
                  {gameOver.winner}
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(gameOver.scores).map(([player, score]) => (
                  <div
                    key={player}
                    className="flex justify-between items-center"
                  >
                    <span
                      className={
                        player === gameOver.winner ? "text-yellow-300" : ""
                      }
                    >
                      {player}
                    </span>
                    <span className="font-bold">{score}</span>
                  </div>
                ))}
              </div>
            </div>
            {isHost ? (
              <button
                onClick={handleRestart}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors"
              >
                Yeni Oyun Başlat
              </button>
            ) : (
              <div className="text-center text-gray-400">
                Oda sahibinin yeni oyun başlatmasını bekleyin...
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
