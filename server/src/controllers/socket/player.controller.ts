import { Socket } from 'socket.io'

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
  INVITE = 'invite'
}

export default class PlayerController {

  public color = Color.WHITE;
  public disponible = true;
  public opponent = ''

  constructor(private socket: Socket) {}

  /**
   *************************************************************************************************
   * Emitter definitions
   */
  public invite(opponent: PlayerController) {
    this.socket.emit(SocketMessage.INVITE, opponent.socket.player)
  }
  
  public giveTurn(state: string) {
    this.socket.emit(SocketMessage.YOURTURN, state)
  }

  public invalidateMove(state: string) {
    this.socket.emit(SocketMessage.INVALIDATE, state)
  }

  public endGame() {
    this.socket.emit(SocketMessage.ENDGAME, {})
  }
  public getPlayer() {
    return this.socket.player
  }

  /**
   *************************************************************************************************
   * Recepter definitions
   */
  public receiveMove(callback: (...args: any) => void) {
    this.socket.on(SocketMessage.MOVE, move => callback(this, move))
  }
}