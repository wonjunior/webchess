import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import { MONGO_CONNECTION_STRING } from './config'
import { Controller } from './controllers/main.controller'
import PlayerResolver from './middleware/PlayerResolver'
import Authenticator from './middleware/Authenticator'

class App {
  public app: Application;
  public controller: Controller
  private authenticator = new Authenticator()
  private playerResolver = new PlayerResolver()

  constructor() {
    this.app = express()

    // app and db configuration
    this.setConfig()
    this.setMongoConfig()

    // assign main controller to handle routes
    this.controller = new Controller(this.app)
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: '50mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    this.app.use(cors())
    this.app.use(this.authenticator.middleware.bind(this.authenticator))
    this.app.use(this.playerResolver.middleware.bind(this.playerResolver))
  }

  private setMongoConfig() {
    mongoose.connect(MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
}

export default new App().app