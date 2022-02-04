import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import { MONGO_CONNECTION_STRING } from './config'
import Router from './router/main.router'
import Authenticator from './middleware/Authenticator'
import historyApiFallback from 'connect-history-api-fallback'


class App {
  public app: Application
  private authenticator = new Authenticator()

  constructor() {
    this.app = express()

    // app and db configuration
    this.setConfig()
    this.setMongoConfig()

    new Router(this.app)
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: '50mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    this.app.use(cors())
    this.app.use(historyApiFallback())
    this.app.use('/', express.static('views'))
    this.app.use(this.authenticator.middleware.bind(this.authenticator))
  }

  private setMongoConfig() {
    mongoose.connect(MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
  }
}

export default new App().app