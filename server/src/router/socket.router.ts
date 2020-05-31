import { Socket } from 'socket.io'

import GameController from '../controllers/socket/game.controller'


export default class SocketRouter {
  gameController = new GameController()

  public route(socket: Socket) {
    const query = socket.handshake.query

    socket.on('invitePlayer', id => console.log('inviting player: ', id))
    socket.on('move', () => console.log('yeah'))

    // if (!query.gameId)
    //   this.gameController.create(socket)
    // else
    //   this.gameController.join(socket)
  }
}