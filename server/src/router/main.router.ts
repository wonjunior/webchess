import { Application } from 'express'

import { PlayerController } from '../controllers/player.controller'

import PlayerResolver from '../middleware/PlayerResolver'

export class Router {
  private playerController: PlayerController
  private playerResolver = new PlayerResolver()

  constructor(private app: Application) {
    this.playerController = new PlayerController()
    this.routes()
  }

  public routes() {
    this.app.route('/players').get(this.playerController.getAllPlayers)
    this.app.route('/player').post(this.playerController.createPlayer)


    // Beyond this point, all controllers will have access to `req.player`
    this.addPlayerResolver()

    this.app.route('/player').get(this.playerController.getPlayer)
    this.app.route("/player/:id").delete(this.playerController.deletePlayer)
    this.app.route('/player/:id').put(this.playerController.updatePlayer)

    this.app.route('/friend/:id').put(this.playerController.addFriend)
    this.app.route('/friend/:id').delete(this.playerController.deleteFriend)
    this.app.route('/friends').get(this.playerController.getFriends)
  }

  /**
   * Adds the PlayerResolver middleware to the Express pipeline
   */
  private addPlayerResolver() {
    this.app.use(this.playerResolver.middleware.bind(this.playerResolver))
  }
}