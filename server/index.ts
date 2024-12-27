import { Server } from 'socket.io'
import { createServer } from 'http'
import { getRandomWord } from './data/words'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  },
  transports: ['websocket', 'polling']
})

interface GameState {
  currentPlayer: string
  word: string
  maskedWord: string
  guessedLetters: string[]
  remainingGuesses: number
  scores: Record<string, number>
  round: number
  category: string
}

const games = new Map<string, GameState>()
const rooms = new Map<string, string[]>()

io.on('connection', (socket) => {
  const roomCode = socket.handshake.query.roomCode as string
  const playerName = socket.handshake.query.playerName as string
  const isHost = socket.handshake.query.isHost === 'true'

  console.log(`Yeni bağlantı: ${playerName} - Oda: ${roomCode} - Host: ${isHost}`)

  if (!roomCode || !playerName) {
    console.log('RoomCode veya PlayerName eksik')
    socket.disconnect()
    return
  }

  if (!rooms.has(roomCode)) {
    console.log(`Yeni oda oluşturuluyor: ${roomCode}`)
    rooms.set(roomCode, [])
  }

  const room = rooms.get(roomCode)
  if (!room) return

  if (room.includes(playerName)) {
    console.log(`${playerName} zaten odada`)
    socket.emit('error', 'Bu isimle zaten bir oyuncu var')
    socket.disconnect()
    return
  }

  if (room.length >= 2) {
    console.log(`${roomCode} odası dolu`)
    socket.emit('error', 'Oda dolu')
    socket.disconnect()
    return
  }

  room.push(playerName)
  socket.join(roomCode)
  console.log(`${playerName} odaya katıldı. Oyuncular:`, room)

  if (room.length === 2) {
    console.log(`${roomCode} odası oyuna başlıyor`)
    const initialState: GameState = {
      currentPlayer: room[0],
      word: getRandomWord('HAYVANLAR'),
      maskedWord: '_'.repeat(getRandomWord('HAYVANLAR').length),
      guessedLetters: [],
      remainingGuesses: 6,
      scores: {
        [room[0]]: 0,
        [room[1]]: 0
      },
      round: 1,
      category: 'HAYVANLAR'
    }
    games.set(roomCode, initialState)
    io.to(roomCode).emit('gameState', initialState)
  }

  io.to(roomCode).emit('players', room)

  socket.on('guess', ({ letter, roomCode }) => {
    const gameState = games.get(roomCode)
    if (!gameState) return

    const room = rooms.get(roomCode)
    if (!room) return

    gameState.guessedLetters.push(letter)

    if (!gameState.word.includes(letter)) {
      gameState.remainingGuesses--
    }

    gameState.maskedWord = gameState.word
      .split('')
      .map(l => gameState.guessedLetters.includes(l) ? l : '_')
      .join('')

    if (gameState.maskedWord === gameState.word || gameState.remainingGuesses === 0) {
      if (gameState.maskedWord === gameState.word) {
        gameState.scores[gameState.currentPlayer]++
      }

      if (gameState.round === 5) {
        io.to(roomCode).emit('gameOver', {
          scores: gameState.scores,
          winner: Object.entries(gameState.scores).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        })
      } else {
        gameState.round++
        gameState.word = getRandomWord('HAYVANLAR')
        gameState.maskedWord = '_'.repeat(gameState.word.length)
        gameState.guessedLetters = []
        gameState.remainingGuesses = 6
        gameState.currentPlayer = room[gameState.round % 2]
        io.to(roomCode).emit('gameState', gameState)
      }
    } else {
      gameState.currentPlayer = gameState.currentPlayer === room[0] ? room[1] : room[0]
      io.to(roomCode).emit('gameState', gameState)
    }
  })

  socket.on('restartGame', ({ roomCode }) => {
    const room = rooms.get(roomCode)
    if (!room || room.length !== 2) return

    const initialState: GameState = {
      currentPlayer: room[0],
      word: getRandomWord('HAYVANLAR'),
      maskedWord: '_'.repeat(getRandomWord('HAYVANLAR').length),
      guessedLetters: [],
      remainingGuesses: 6,
      scores: {
        [room[0]]: 0,
        [room[1]]: 0
      },
      round: 1,
      category: 'HAYVANLAR'
    }
    
    games.set(roomCode, initialState)
    io.to(roomCode).emit('gameState', initialState)
  })

  socket.on('disconnect', () => {
    const room = rooms.get(roomCode)
    if (room) {
      const index = room.indexOf(playerName)
      if (index > -1) {
        room.splice(index, 1)
      }
      if (room.length === 0) {
        rooms.delete(roomCode)
        games.delete(roomCode)
      }
    }
  })
})

httpServer.listen(3002)