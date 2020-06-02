

import PlayerController from '../controllers/socket/player.controller'
import { PlayerModel } from '../models/player.model'
import GameModel from '../models/game.model'
import { Socket } from 'socket.io'
import GameController  from '../controllers/socket/game.controller'


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
  private controller: GameController

  // GameModel owns the game's id
  get id() { return Game.model.id }
  set id(id: string) { Game.model.id = id }

  constructor(controller: GameController) {
    this.controller = controller
  }

  async create(p1: PlayerController, p2: PlayerController) {
    this.white = p1
    this.black = p2
    this.white.color = Color.WHITE;
    this.black.color = Color.BLACK;

    const { status } = await Game.model.create()

    if (status != ChessAPI.Status.STARTED) return console.error('[Chess API] Game creation failed')

    console.info(`[${this.id}] created game`)

    // setup receptors on both sockets
    this.black.receiveMove(this.onMoveReceived.bind(this))
    this.white.receiveMove(this.onMoveReceived.bind(this))

    this.current = this.white
    this.current.giveTurn(this.state)
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

    const { status } = await Game.model.gameState()
    if (status != ChessAPI.Endgame.CONTINUE)
      return this.endGame(status)

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

  private async endGame(status: string) {
    //we take the point of view of the white for calculus
    let result = 0.5
    let winner = '-'
    const evolutionFactor = 50.0
    if (status == ChessAPI.Endgame.CHECKMATE) {
      if (this.current.color == Color.BLACK) {
        result = 1.0
        winner = 'w'
      }
      else {
        result = 0.0
        winner = 'b'
      }
    }
    const blackElo = this.black.player.elo
    const whiteElo = this.white.player.elo
    const estimation = 1.0 / (1 + Math.pow(10, (blackElo - whiteElo)/400))
    const delta_elo_white = Math.floor(evolutionFactor * (result - estimation))
    const whiteModel = new PlayerModel(this.black.player)
    const blackModel = new PlayerModel(this.white.player)
    whiteModel.setElo(whiteElo + delta_elo_white)
    blackModel.setElo(blackElo - delta_elo_white)

    this.white.endGame()
    this.black.endGame()

    this.controller.deleteGame(this.id)

    const { pgn } = await Game.model.getPGN()
    const white = {
      name: this.white.player.name,
      id: this.white.player.id
    }
    const black = {
      name: this.black.player.name,
      id: this.black.player.id
    }
    whiteModel.archiveGame(white, black, pgn, winner)
    blackModel.archiveGame(white, black, pgn, winner)
  }
}