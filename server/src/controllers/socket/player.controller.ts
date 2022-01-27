import { Socket } from 'socket.io'
import GameController from './game.controller'
import { Color } from '../../services/game'

enum SocketMessage {
  MOVE = 'move',
  YOURTURN = 'yourTurn',
  ENDGAME = 'gameover',
  INVALIDATE = 'invalidate',
  INVITE = 'invite',
  JOIN = 'join',
  DISCONNECT = 'disconnect',
  QUIT = 'quit',
  START = 'start'
}

export default class PlayerController {

  public color = Color.WHITE;
  public available = true;
  public opponent = ''
  public game_id = ""

  get player() { return this.socket.player }
  get id() { return this.socket.player.id }

  constructor(private socket: Socket) {}

  /**
   *************************************************************************************************
   * Emitter definitions
   */
  public invite(opponent: PlayerController) {
    const player = { id: opponent.id, name: opponent.player.name }
    this.socket.emit(SocketMessage.INVITE, player)
  }

  public giveTurn(state: string) {
    this.socket.emit(SocketMessage.YOURTURN, state)
  }

  public invalidateMove(state: string) {
    this.socket.emit(SocketMessage.INVALIDATE, state)
  }

  public endGame() {
    this.socket.emit(SocketMessage.ENDGAME, {})
    this.available = true
    this.opponent = ""
  }

  public startGame() {
    this.socket.emit(SocketMessage.START,{})
  }

  /**
   *************************************************************************************************
   * Receptor definitions
   */
  public receiveMove(callback: (...args: any) => void) {
    this.socket.on(SocketMessage.MOVE, move => callback(this, move))
  }

  public receiveInvite(gameController: GameController) {
    this.socket.on(SocketMessage.INVITE, (opponent: string) => {
      console.log('inviting player: ', opponent)
      console.log('My name is:' + this.game_id)
      gameController.invite(this.socket, opponent)
    })
  }

  public receiveConfirmation(gameController: GameController) {
    this.socket.on(SocketMessage.JOIN, (opponent: string) => {
      console.log('accepting match with player: ', opponent)
      gameController.acceptInvitation(this.socket, opponent)
    })
  }
  public onQuitGame(gameController: GameController) {
    this.socket.on(SocketMessage.QUIT, () => {
      if (this.available) return console.info('that player is not in a game: ', this.player.name)
      //if a player quit a game, he loses the game
      gameController.quitGame(this.game_id, this.color) 
      console.log(this.player.name + 'has left the game ' + this.game_id)
    })
  }
  public onDisconnect(gameController: GameController) {
    this.socket.on(SocketMessage.DISCONNECT, (reason: string) => {
      console.log(this.player.name, ' has been disconnected. Reason: ', reason)
      //if the player was in a game, quit it
      if (!this.available) {
        console.log(this.player.name + 'has left the game ' + this.game_id)
        gameController.quitGame(this.game_id, this.color) 
      }
      gameController.deletePlayer(this.id)
    })
  }
}