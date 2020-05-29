import { Socket } from 'socket.io'

import { Game } from '../../services/game'
import { WebChessSocket } from '../../middleware/Helpers'


export default class GameController {
  private games: Map<string, Game> = new Map()

  public async create(socket: WebChessSocket) {
    const game = new Game()
    await game.create(socket)

    this.games.set(game.id, game)
    console.info('A new game has been created with id:', game.id)

    socket.game = game.id
  }

  public join(socket: WebChessSocket) {
    const id = socket.handshake.query.gameId
    const game = this.games.get(id)
    if (!game) return console.error('no game found with id', id)

    game.join(socket)
    console.info('A player has joined game session', id)

    socket.game = id
  }
}