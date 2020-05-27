import { Socket } from "socket.io";
import Ajax from "../utils/Ajax";
import { WebChessSocket } from '../middleware/Helpers'
import { CHESS_API_ROOT } from '../config'

interface Move {
  from: string;
  to: string;
}
enum Color {
  BLACK = 'b',
  WHITE = 'w'
}
enum ChessApiStatus {
  MOVED = 'figure moved',
  STARTED = 'new game started',
}

// responses string codes from Chess API
namespace ChessAPI {
  export enum Status {
    MOVED = 'figure moved',
    STARTED = 'new game started',
  }
  export enum Endgame {
    CHECKMATE = 'checkmate',
    STALEMATE = 'stalemate',
    DRAW = 'draw',
    REPETITION = 'threefold repetition',
    INSUFFICIENT = 'insufficient material',
    CONTINUE = 'game continues',
  }
}

enum SocketMessage {
  MOVE = 'move',
  YOURTURN = 'yourTurn',
  ENDGAME = 'gameover',
}

enum FEN {
  RESET = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
}

const EmptySocket = {} as Socket

export class Game {
  static chessAPI = new Ajax(CHESS_API_ROOT)

  private socketWhite = EmptySocket
  private socketBlack = EmptySocket
  private current = Color.WHITE
  private state = FEN.RESET

  public id = ''

  async create(socket: WebChessSocket) {
    this.socketWhite = socket
    const { status, game_id } = await Game.chessAPI.get()

    if (status != ChessAPI.Status.STARTED) return console.error('[Chess API] Game creation failed')

    this.id = game_id
  }

  join(socket: WebChessSocket): boolean {
    if (this.socketWhite == EmptySocket) return false

    this.socketBlack = socket
    console.info(`[${this.id}] second player joined game`)

    this.watchMoves()

    this.turnIs(Color.WHITE)

    return true
  }

  turnIs(color: Color) {
    switch (color) {
      case Color.WHITE: return this.socketWhite.emit(SocketMessage.YOURTURN, this.state)
      case Color.BLACK: return this.socketBlack.emit(SocketMessage.YOURTURN, this.state)
    }
  }

  watchMoves() {
    this.socketBlack.on(SocketMessage.MOVE,  move => this.onMoveReceived(move, Color.BLACK))
    this.socketWhite.on(SocketMessage.MOVE, move => this.onMoveReceived(move, Color.WHITE))
  }

  async onMoveReceived(move: Move, color: Color) {
    console.info(`[${this.id}] received move from ${color}`)

    if (color != this.current) return null

    if (!(await this.play(move))) return null

    if (await this.checkGameOver()) return null

    this.turnIs(this.current)
  }

  async checkGameOver(): Promise<boolean> {
    const { status } = await Game.chessAPI.post('check', { game_id: this.id })

    if (status == ChessAPI.Endgame.CONTINUE) return false

    this.socketBlack.emit(SocketMessage.ENDGAME, {})
    this.socketWhite.emit(SocketMessage.ENDGAME, {})
    return true
  }

  // our source of truth is the 3rd party chess REST API
  async play({from, to}: Move): Promise<boolean> {
    const { status } = await Game.chessAPI.post('move', { from, to, game_id: this.id })
    if (status != ChessApiStatus.MOVED) return false

    const { fen_string } = await Game.chessAPI.post('fen', { game_id: this.id })
    if (!fen_string) {
      console.error('[Chess API] Fetching FEN from API failed')
      return false
    }

    this.current = (this.current == Color.WHITE) ? Color.BLACK : Color.WHITE
    this.state = fen_string
    return true
  }
}