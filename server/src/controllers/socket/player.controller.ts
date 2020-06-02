import { Socket } from 'socket.io'
import GameController from './game.controller'

interface Move {
  from: string;
  to: string;
}
enum Color {
  BLACK = 'b',
  WHITE = 'w'
}
enum SocketMessage {
  MOVE = 'move',
  YOURTURN = 'yourTurn',
  ENDGAME = 'gameover',
  INVALIDATE = 'invalidate',
  INVITE = 'invite',
  JOIN = 'join',
}

export default class PlayerController {

  public color = Color.WHITE;
  public available = true;
  public opponent = ''

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
      gameController.invite(this.socket, opponent)
    })
  }

  public receiveConfirmation(gameController: GameController) {
    this.socket.on(SocketMessage.JOIN, (opponent: string) => {
      console.log('accepting match with player: ', opponent)
      gameController.acceptInvitation(this.socket, opponent)
    })
  }
  public onDisconnect(callback: any){
    this.socket.on('disconnect', callback)
  }
}