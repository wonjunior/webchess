import { Socket } from 'socket.io'

import GameController from '../controllers/socket/game.controller'


export default class SocketRouter {
  gameController = new GameController()

  public route(socket: Socket) {
    this.gameController.newPlayer(socket)

    socket.on('invite', (opponent) => {
      console.log('inviting player: ', opponent)
      this.gameController.invite(socket, opponent)
    })

    socket.on('accept', (opponent) => {
      console.log('accepting match with player: ', opponent)
      this.gameController.acceptInvitation(socket, opponent)
    })
  }
}