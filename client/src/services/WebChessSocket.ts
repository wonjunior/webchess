import io from 'socket.io-client'

export enum SocketEmitMessage {
  INVITE = 'invite',
  MOVE = 'move',
}
export enum SocketReceiveMessage {
  YOURTURN = 'yourTurn',
  INVALIDATE = 'invalidate'
}

export class WebChessSocket {
  socket: SocketIOClient.Socket

  constructor(token: string) {
    this.socket = io(process.env.VUE_APP_BACKEND_ROOT, { query: { token: 'Bearer ' + token }})
  }

  emit(msg: SocketEmitMessage, o: any) {
    this.socket.emit(msg, o)
  }

  on(msg: SocketReceiveMessage, callback: (...args: any) => void) {
    this.socket.on(msg, callback)
  }
}