import { Socket } from 'socket.io'

import GameController from '../controllers/socket/game.controller'


export default class SocketRouter {
  gameController = new GameController()

  public route(socket: Socket) {
    const query = socket.handshake.query

    if (!query.gameId)
      this.gameController.create(socket)
    else
      this.gameController.join(socket)
  }
}