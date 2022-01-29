

import PlayerController from '../controllers/socket/player.controller'
import { PlayerModel } from '../models/player.model'
import GameController  from '../controllers/socket/game.controller'
import * as chessjs from 'chess.js'

export interface Move {
  from: string;
  to: string;
}
export enum Color {
  BLACK = 'b',
  WHITE = 'w'
}
enum FEN {
  INITIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
}
export enum ChessResult {
  //we take the point of view of the white for the result
  BLACK_WON = 0,
  WHITE_WON = 1,
  DRAW = 0.5
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

  create(p1: PlayerController, p2: PlayerController) {
    console.info(`[${this.id}] created game`)

    this.white = p1
    this.black = p2
    this.white.color = Color.WHITE;
    this.black.color = Color.BLACK;
    this.white.game_id = this.id
    this.black.game_id = this.id

    // setup receptors on both sockets
    this.black.receiveMove(this.onMoveReceived.bind(this))
    this.white.receiveMove(this.onMoveReceived.bind(this))

    this.current = this.white
    this.current.giveTurn(this.state)
  }

  private onMoveReceived(sender: PlayerController, move: Move) {
    console.info(`[${this.id}] move -> sender: ${sender.color} current: ${this.current.color}`)

    // we copy the current player to make sure it is not
    // overridden by a concurrent call by the opponent
    const current = this.current

    if (sender.color != current.color || !this.play(current, move)) {
      console.log('invalidating move from ', sender.color, current.color)
      return sender.invalidateMove(this.state)
    }
    sender.validateMove()

    if (this.chessInstance.game_over())
      return this.endGame(this.getGameResult())

    this.current.giveTurn(this.state)
  }

  private play(player: PlayerController, move: Move): boolean {
    console.log('[playing]', move)
    if (this.chessInstance.move(move as chessjs.Move) == null) return false
    this.current = (player.color == Color.WHITE) ? this.black : this.white
    this.state = this.chessInstance.fen()
    return true
  }

  private getGameResult() : ChessResult {
    if (this.chessInstance.in_checkmate()) {
      if (this.current.color == Color.BLACK) {
        return ChessResult.WHITE_WON
      }
      else {
        return ChessResult.BLACK_WON
      }
    }
    else {
      return ChessResult.DRAW
    }
  }

  public endGame(result: ChessResult) {
    let winner = '-'
    if (result == ChessResult.WHITE_WON) {
      winner = 'w'
      console.log('[endGame] White won by checkmate')
    }
    else if (result == ChessResult.BLACK_WON) {
      winner = 'b'
      console.log('[endGame] Black won by checkmate')
    }
    else
      console.log('[endGame] Draw game')

    
    const evolutionFactor = 50.0
    const blackElo = this.black.player.elo
    const whiteElo = this.white.player.elo
    const estimation = 1.0 / (1 + Math.pow(10, (blackElo - whiteElo)/400))

    //result = 1 if white won and 0 if black won and 0.5 if draw
    const delta_elo_white = Math.floor(evolutionFactor * (result - estimation))

    console.log(this.white.player.name + ': ' + this.white.player.elo + ' + ' + String(delta_elo_white))
    console.log(this.black.player.name + ': ' + this.black.player.elo + ' - ' + String(delta_elo_white))


    const whiteModel = new PlayerModel(this.white.player)
    const blackModel = new PlayerModel(this.black.player)
    whiteModel.setElo(whiteElo + delta_elo_white)
    blackModel.setElo(blackElo - delta_elo_white)

    this.white.endGame(result, delta_elo_white)
    this.black.endGame(result, delta_elo_white)

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