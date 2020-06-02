import { Request, Response, NextFunction } from 'express'

import { WebChessError, databaseErrorHandling } from './Helpers'
import { PlayerEntity, Player } from '../schemas/player.schema'
import { Socket } from 'socket.io'


export default class PlayerResolver {

  /**
   * Used in Express' middleware pipeline: resolves the player with the request's email. If the
   * operation is successful the player is stored inside the Request object and the next middleware
   * in line is called.
   */
  async middleware(req: Request, res: Response, next: NextFunction): Promise<void | Response<any>> {
    const response = await this.call(req.email)

    if ((response as WebChessError).error) return res.json(response)

    req.player = response as Player
    next()
  }

  /**
   * Used in Socket.io' middleware pipeline: resolves the player with the request's email. If the
   * operation is successful the player is stored inside the socket and the next middleware in line
   * is called.
   */
  async socketMiddleware(socket: Socket, next: NextFunction) {
    const response = await this.call(socket.email)

    if ((response as WebChessError).error) {
      console.log(response)
      return;
    }

    socket.player = response as Player
    return next()
  }


  /**
   * Finds player in the database by its email
   * @param email the player's email
   */
  async call(email: string): Promise<Player | WebChessError> {
    return await PlayerEntity
      .findOne({ email })
      .then((p: Player | null) => p || { error: 'Player not found' })
      .catch(databaseErrorHandling)
  }
}