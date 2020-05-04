import { Application } from 'express'

import { PlayerController } from './player.controller'
import { PlayerModel } from '../models/player.model'
import { PlayerEntity } from '../schemas/player.schema'

export class Controller {
  private playerController: PlayerController

  constructor(private app: Application) {
    this.playerController = new PlayerController()
    this.routes()
  }

  public routes() {
    this.app.route('/').get((req, res) => { res.json({m:'yes'}) })

    // players
    this.app.route('/players').get(this.playerController.getAllPlayers)
    this.app.route('/player').post(this.playerController.createPlayer)
    this.app.route('/player').get(this.playerController.getPlayer)
    this.app.route("/player/:id").delete(this.playerController.deletePlayer)
    this.app.route('/player/:id').put(this.playerController.updatePlayer)

    // friends
    this.app.route('/friend/:id').put(this.playerController.addFriend)
    this.app.route('/friend/:id').delete(this.playerController.deleteFriend)
    this.app.route('/friends').get(this.playerController.getFriends)
  }
}