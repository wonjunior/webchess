import { Socket } from 'socket.io'

import GameController from '../controllers/socket/game.controller'
import { WebChessSocket } from '../middleware/Helpers'

export default class SocketRouter {
  gameController = new GameController()

  public route(socket: WebChessSocket) {
    const query = socket.handshake.query

    if (!query.gameId)
      this.gameController.create(socket)
    else
      this.gameController.join(socket)
  }
}