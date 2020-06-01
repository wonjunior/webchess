import { Socket } from 'socket.io'

import GameController from '../controllers/socket/game.controller'


export default class SocketRouter {
  gameController = new GameController()

  public route(socket: Socket) {
    this.gameController.newPlayer(socket)
  }
}