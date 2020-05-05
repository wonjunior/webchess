import { Request, Response, NextFunction } from 'express'

import { WebChessError, databaseErrorHandling } from './Helpers'
import { PlayerEntity, Player } from '../schemas/player.schema'


export default class PlayerResolver {

  /**
   * Used in Express' middleware pipeline
   * Resolves the player with the request's email
   * If the operation is successful the player is stored inside the Request
   * object and the next middleware in line is called
   */
  async middleware(req: Request, res: Response, next: NextFunction): Promise<void | Response<any>> {
    const response = await this.call(req.email)

    if ((response as WebChessError).error) return res.json(response)

    req.player = response as Player
    next()
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