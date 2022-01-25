

import PlayerController from '../controllers/socket/player.controller'
import { PlayerModel } from '../models/player.model'
import { Socket } from 'socket.io'
import GameController  from '../controllers/socket/game.controller'
import * as chessjs from 'chess.js'

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
    CHECKMATE = 'check mate',
    STALEMATE = 'stale mate',
    DRAW = 'draw',
    REPETITION = 'threefold repetition',
    INSUFFICIENT = 'insufficient material',
    CONTINUE = 'game continues',
  }
}
const defaultPlayer = {} as PlayerController

export class Game {

  private static availablesIds: number[] = []
  private static gamesCounter: number = 0

  
  private chessInstance: chessjs.ChessInstance
  private white = defaultPlayer
  private black = defaultPlayer
  private current = defaultPlayer
  private state : string = FEN.INITIAL
  private controller: GameController
  public id : string

  constructor(controller: GameController) {
    this.controller = controller
    this.chessInstance = new chessjs.Chess(FEN.INITIAL);

    //create or recyle game id
    if (Game.availablesIds.length > 0) {
      this.id = String(Game.availablesIds.pop())
    } else {
      this.id = String(Game.gamesCounter++)
    }
  }

  async create(p1: PlayerController, p2: PlayerController) {
    console.info(`[${this.id}] created game`)

    this.white = p1
    this.black = p2
    this.white.color = Color.WHITE;
    this.black.color = Color.BLACK;

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

    if (sender.color != current.color || !(await this.play(current, move))) {
      console.log('invalidating move from ', sender.color)
      return sender.invalidateMove(this.state)
    }

    if (this.chessInstance.game_over())
      return this.endGame()

    this.current.giveTurn(this.state)
  }

  private async play(player: PlayerController, move: Move): Promise<boolean | void> {
    console.log('[playing]', move)
    if (this.chessInstance.move(move as chessjs.Move) == null) return false
    this.current = (player.color == Color.WHITE) ? this.black : this.white
    this.state = this.chessInstance.fen()
    return true
  }

  private async endGame() {
    
    //we take the point of view of the white for calculus
    let result = 0.5
    let winner = '-'
    const evolutionFactor = 50.0
    if (this.chessInstance.in_checkmate()) {
      if (this.current.color == Color.BLACK) {
        console.log('[endGame] White won by checkmate')
        result = 1.0
        winner = 'w'
      }
      else {
        console.log('[endGame] Black won by checkmate')
        result = 0.0
        winner = 'b'
      }
    }
    else {
      console.log('[endGame] Draw game')
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

    Game.availablesIds.push(parseInt(this.id, 10))
    this.controller.deleteGame(this.id)

    const pgn = this.chessInstance.pgn()
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