import { Request, Response } from "express";
import { Types, MongooseDocument, Query } from "mongoose";

import { Player } from "../models/player.model";

export class PlayerService {
  public welcomeMessage(req: Request, res: Response) {
    return res.status(200).send("Welcome to chessAPI!");
  }

  public getAllPlayers(req: Request, res: Response) {
    Player.find({}, (error: Error, player: MongooseDocument) => {
      if(error) return res.send(error);
      res.json(player);
    });
  }

  // normal function w/ callback
  // public getPlayer(req: Request, res: Response) {
  //   Player.findById(req.params.id, (error: Error, player: MongooseDocument) => {
  //     if (error) return res.send(error);
  //     res.json(player);
  //   });
  // }

  // async-await with try/catch block
  // public async getPlayer(req: Request, res: Response) {
  //   try {
  //     const player = await Player.findById(req.params.id);
  //     res.json(player);
  //   } catch(error) {
  //     res.send('furrrrh');
  //   }
  // }

  //.then .catch callbacks
  // public getPlayer(req: Request, res: Response) {
  //   Player.findById(req.params.id)
  //     .then(p => {
  //       res.json(p);
  //     })
  //     .catch(err => {
  //       res.send('furrrrrrrrh');
  //     });
  // }

  // async-await linear
  public async getPlayer(req: Request, res: Response) {

    if (!Types.ObjectId.isValid(req.params.id)) return res.send('not valid id')

    const player = await Player.findById(req.params.id);
    if (!player) return res.send('player not found');

    res.send(player);
  }

  public addNewPlayer(req: Request, res: Response) {
    const player = new Player(req.body);
    player.save((error: Error, player: MongooseDocument) => {
      if (error) res.send(error);
      res.json(player);
    });
  }

  public deletePlayer(req: Request, res: Response) {
    const playerId = req.params.id;
    Player.findByIdAndDelete(playerId, (error: Error, deleted: any) => {
      if (error) return res.send(error);
      const message = deleted ? 'deleted successfully' : 'player not found';
      // res.json({ message });
      res.send(message);
    });
  }

  public updatePlayer(req: Request, res: Response) {
    const playerId = req.params.id;
    Player.findByIdAndUpdate(playerId, req.body, (error: Error, player: any) => {
      if (error) return res.send(error);
      const message = player ? 'updated succesfully' : 'pokemon not found';
      res.send(message);
    });
  }
}
