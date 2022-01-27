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
  INVITATION = 'invite',
  ENDGAME = 'gameover',
  START = 'start'
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
    this.socket.on(msg, callback)
  }
}