import { Server } from 'http'
import SocketIOServer from 'socket.io'

import SocketRouter from './router/socket.router'
import { WebChessSocket } from './middleware/Helpers'

export interface IUser {
  id: string;
  name: string;
}

enum WebSocketServerStatus {
  CONNECTION = 'connection'
}

export default class WebSocketServer {
  private io: SocketIOServer.Server
  private router: SocketRouter

  constructor(server: Server) {
    this.io = SocketIOServer(server)

    this.setConfig()

    this.router = new SocketRouter()
  }

  private setConfig() {
    // this.io.use(async (socket, next) => {}
  }

  public listen() {
    this.io.on(WebSocketServerStatus.CONNECTION, (s: WebChessSocket) => this.router.route(s))
  }
}