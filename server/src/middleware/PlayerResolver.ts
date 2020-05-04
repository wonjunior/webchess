import { Request, Response, NextFunction } from 'express'

import { WebChessError } from './Helpers'
import { PlayerEntity, Player } from '../schemas/player.schema'

/**
 * Middleware used to fetch the player's document in db by its email
 * if the operation is successful the player is stored inside the Request
 * object and the next middleware function is called
 */
export default class PlayerResolver {
  async call(req: Request, res: Response, next: NextFunction) {
    const response = await PlayerEntity
      .findOne({email: req.email})
      .then((p: Player | null) => p || { error: 'Player not found' })
      .catch(_ => ({ error: 'Database error while resolving player' }))

    if ((response as WebChessError).error) return res.json(response)

    req.player = response as Player
    next()
  }
}