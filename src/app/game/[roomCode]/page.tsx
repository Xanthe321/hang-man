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
    const newSocket = io("http://localhost:3002", {
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

  if (!gameState || !socket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="text-xl mb-4">Bağlantı durumu: {connectionStatus}</div>
        <div className="text-xl mb-4">Oda Kodu: {roomCode}</div>
        <div className="text-xl mb-4">Oyuncular ({players.length}/2):</div>
        {players.map((player, index) => (
          <div key={index} className="text-lg">
            {player} {player === playerName ? "(Sen)" : ""}
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="mb-4 text-center">
        <h2 className="text-xl mb-2">Oda Kodu: {roomCode}</h2>
        <div className="text-lg mb-2">Round: {gameState.round}/5</div>
        <div className="text-lg mb-2">Kategori: {gameState.category}</div>
        <div className="text-lg mb-2 text-yellow-300">
          Sıra: {gameState.currentPlayer}{" "}
          {gameState.currentPlayer === playerName ? "(Sen)" : ""}
        </div>
      </div>

      <div className="mb-6 text-center">
        <div className="text-lg mb-2">Skorlar:</div>
        {Object.entries(gameState.scores).map(([player, score]) => (
          <div
            key={player}
            className={`${
              player === playerName ? "text-yellow-300" : "text-white"
            }`}
          >
            {player}: {score}
          </div>
        ))}
      </div>

      <Hangman mistakes={6 - gameState.remainingGuesses} />

      <div className="text-4xl mb-6 font-mono tracking-widest">
        {gameState.maskedWord.split("").join(" ")}
      </div>

      <div className="mb-4">Kalan Hak: {gameState.remainingGuesses}</div>

      <div className="grid grid-cols-7 gap-3 mt-4 max-w-2xl mx-auto">
        {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZİŞĞÜÇÖ").map((letter) => (
          <button
            key={letter}
            onClick={() => socket.emit("guess", { letter, roomCode })}
            disabled={
              gameState.currentPlayer !== playerName ||
              gameState.guessedLetters.includes(letter)
            }
            className={`
              w-12 h-12 text-lg font-bold rounded-lg transition-all
              ${
                gameState.guessedLetters.includes(letter)
                  ? "bg-gray-700 text-gray-500"
                  : gameState.currentPlayer === playerName
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-800 text-gray-400"
              }
              ${
                gameState.currentPlayer === playerName
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }
            `}
          >
            {letter}
          </button>
        ))}
      </div>

      {gameState.currentPlayer === playerName && (
        <div className="mt-4 text-green-400">Senin sıran!</div>
      )}

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <h2 className="text-2xl mb-4">Oyun Bitti!</h2>
            <h3 className="text-xl mb-6">Kazanan: {gameOver.winner}</h3>

            <div className="mb-6">
              <h4 className="text-lg mb-2">Final Skorları:</h4>
              {Object.entries(gameOver.scores).map(([player, score]) => (
                <div
                  key={player}
                  className={`${
                    player === gameOver.winner ? "text-yellow-300" : ""
                  }`}
                >
                  {player}: {score}
                </div>
              ))}
            </div>

            {isHost && (
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold"
              >
                Yeni Oyun Başlat
              </button>
            )}
            {!isHost && (
              <div className="text-gray-400">
                Oda sahibinin yeni oyun başlatmasını bekleyin...
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
