import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose, { connection } from 'mongoose';

import { Controller } from './main.controller';

class App {
  public app: Application;
  public chessController: Controller;

  constructor() {
    this.app = express();

    // app and db configuration
    this.setConfig();
    this.setMongoConfig();

    //Creating and assigning a new instance of our controller
    this.chessController = new Controller(this.app);

  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(cors());
  }

  private setMongoConfig() {
    const connectionString = "mongodb+srv://webchess_admin:seJ1ZsqYYFddQfh3@webchess-waoo7.mongodb.net/test?retryWrites=true&w=majority";
    // mongoose.Promise = global.Promise;
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export default new App().app;