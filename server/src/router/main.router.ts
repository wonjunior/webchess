import { Application } from 'express'

import { PlayerController } from '../controllers/player.controller'
import { GameController } from '../controllers/game.controller'

import PlayerResolver from '../middleware/PlayerResolver'

export class Router {
  private playerController = new PlayerController
  private gameController = new GameController()
  private playerResolver = new PlayerResolver()

  constructor(private app: Application) {
    this.routes()
  }

  public routes() {
    this.app.route('/players').get(this.playerController.getAllPlayers)
    this.app.route('/player').post(this.playerController.createPlayer)

    // Beyond this point, all controllers will have access to the player through the Request
    // e.g. for `req: Request`, the current logged in player is `req.player`
    this.addPlayerResolver()

    this.app.route('/player').get(this.playerController.getPlayer)
    this.app.route("/player/:id").delete(this.playerController.deletePlayer)
    this.app.route('/player/:id').put(this.playerController.updatePlayer)

    this.app.route('/friend/:id').put(this.playerController.addFriend)
    this.app.route('/friend/:id').delete(this.playerController.deleteFriend)
    this.app.route('/friends').get(this.playerController.getFriends)

    // games
    this.app.route('/game/save').put(this.gameController.saveGame)
  }

  /**
   * Adds the PlayerResolver middleware to the Express pipeline
   */
  private addPlayerResolver() {
    this.app.use(this.playerResolver.middleware.bind(this.playerResolver))
  }
}