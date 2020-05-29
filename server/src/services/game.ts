import { WebChessSocket } from '../middleware/Helpers'

import PlayerController from '../controllers/socket/player.controller'
import GameModel from '../models/game.model'


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
enum FEN {
  INITIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
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
const defaultPlayer = {} as PlayerController

export class Game {
  static model = new GameModel()

  private white = defaultPlayer
  private black = defaultPlayer
  private current = defaultPlayer
  private state = FEN.INITIAL

  // GameModel owns the game's id
  get id() { return Game.model.id }
  set id(id: string) { Game.model.id = id }

  async create(socket: WebChessSocket) {
    this.white = new PlayerController(socket, Color.WHITE)
    const { status } = await Game.model.create()

    if (status != ChessAPI.Status.STARTED) return console.error('[Chess API] Game creation failed')

    console.info(`[${this.id}] player created game`)
  }

  join(socket: WebChessSocket): boolean {
    if (this.white == defaultPlayer) return false

    this.black = new PlayerController(socket, Color.BLACK)
    console.info(`[${this.id}] second player joined game`)

    // setup receptors on both sockets
    this.black.receiveMove(this.onMoveReceived.bind(this))
    this.white.receiveMove(this.onMoveReceived.bind(this))

    this.current = this.white
    this.current.giveTurn(this.state)

    return true
  }

  async onMoveReceived(sender: PlayerController, move: Move) {
    console.info(`[${this.id}] move -> sender: ${sender.color} current: ${this.current.color}`)

    // we copy the current player to make sure it is not
    // overridden by a concurrent call by the opponent
    const current = this.current

    if (sender.color != current.color || !(await this.play(current, move)))
    {
      console.log('invalidating move from ', sender.color)
      return sender.invalidateMove(this.state)
    }

    if (await this.isGameOver())
      return this.endGame()

    this.current.giveTurn(this.state)
  }

  private async play(player: PlayerController, move: Move): Promise<boolean | void> {
    console.log('playing---')
    const { status } = await Game.model.play(move)
    if (status != ChessApiStatus.MOVED) return false

    const { fen_string } = await Game.model.getFEN()
    // if (!pgn) return console.error('[Chess API] Fetching FEN from API failed')

    this.current = (player.color == Color.WHITE) ? this.black : this.white
    this.state = fen_string

    return true
  }

  private async isGameOver(): Promise<boolean> {
    const { status } = await Game.model.gameState()
    return status != ChessAPI.Endgame.CONTINUE
  }

  private endGame() {
    this.white.endGame()
    this.black.endGame()
  }
}