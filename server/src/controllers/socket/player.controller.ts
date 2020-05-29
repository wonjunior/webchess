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
  INVALIDATE = 'invalidate'
}

export default class PlayerController {
  constructor(private socket: Socket, public color: Color) {}

  /**
   *************************************************************************************************
   * Emitter definitions
   */
  public giveTurn(state: string) {
    this.socket.emit(SocketMessage.YOURTURN, state)
  }

  public invalidateMove(state: string) {
    this.socket.emit(SocketMessage.INVALIDATE, state)
  }

  public endGame() {
    this.socket.emit(SocketMessage.ENDGAME, {})
  }

  /**
   *************************************************************************************************
   * Recepter definitions
   */
  public receiveMove(callback: (...args: any) => void) {
    this.socket.on(SocketMessage.MOVE, move => callback(this, move))
  }
}