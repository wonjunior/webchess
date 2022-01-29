import io from 'socket.io-client'

export enum SocketEmitMessage {
  INVITE = 'invite',
  MOVE = 'move',
  JOIN = 'join',
  QUIT = 'quit'
}
export enum SocketReceiveMessage {
  YOURTURN = 'yourTurn',
  INVALIDATE = 'invalidate',
  VALIDATE = 'validate',
  INVITATION = 'invite',
  ENDGAME = 'gameover',
  START = 'start'
}

export interface StartMsg {
  white: string;
  white_elo: number;
  black: string;
  black_elo: number;
}

export enum ChessResult {
  //we take the point of view of the white for the result
  BLACK_WON = 0,
  WHITE_WON = 1,
  DRAW = 0.5
}

export interface EndMsg {
  result: ChessResult;
  white_elo_diff: number;
}

export class WebChessSocket {
  socket: SocketIOClient.Socket

  constructor(token: string) {
    this.socket = io(process.env.VUE_APP_BACKEND_ROOT, { query: { token: 'Bearer ' + token }})
  }

  emit(msg: SocketEmitMessage, args: unknown) {
    this.socket.emit(msg, args)
  }

  on(msg: SocketReceiveMessage, callback: Function) {
    //this.socket.removeAllListeners()
    this.socket.on(msg, callback)
  }
}