import { Server } from 'http'
import SocketIOServer from 'socket.io'

import SocketRouter from './router/socket.router'
import Authenticator from './middleware/Authenticator'
import PlayerResolver from './middleware/PlayerResolver'

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
    const authenticator = new Authenticator();
    const playerResolver = new PlayerResolver();
    this.io
      .use(authenticator.socketMiddleware.bind(authenticator))
      .use(playerResolver.socketMiddleware.bind(playerResolver))
  }

  public listen() {
    this.io.on(WebSocketServerStatus.CONNECTION, this.router.route.bind(this.router))
  }
}