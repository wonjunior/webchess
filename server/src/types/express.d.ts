import { Player } from '../schemas/player.schema'

declare global {
  namespace Express {
    interface Request {
      email: string,
      player: Player,
    }
  }
}