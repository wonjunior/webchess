import { Request, Response } from "express";
import { Types, MongooseDocument, Query } from "mongoose";

import { PlayerEntity } from "../schemas/player.schema";
import { PlayerModel } from "../models/player.model"

export class PlayerController {

  public welcomeMessage(req: Request, res: Response) {
    return res.status(200).send(req.params.email);
  }


  public getAllPlayers(req: Request, res: Response) {
    PlayerEntity.find({}, (error: Error, player: MongooseDocument) => {
      if(error) return res.send(error);
      res.json(player);
    });
  }

  // async-await linear
  public async getPlayer(req: Request, res: Response) {

   // if (!Types.ObjectId.isValid(req.params.id)) return res.send('not valid id')
    res.json(req.body.player);
  }

  //Friends
  public async addFriend(req: Request, res: Response) {
    res.json(await new PlayerModel().addFriend(req.body.player, req.params.id))

  }
  public async deleteFriend(req: Request, res: Response) {
    res.json(await new PlayerModel().deleteFriend(req.body.player, req.params.id))
  }
  public async getFriends(req: Request, res: Response) {
    res.json(await new PlayerModel().getFriends(req.body.player))
  }

  public async addNewPlayer(req: Request, res: Response) {
    const ok = await new PlayerModel().addNew(req.body);
    res.json({error: !ok})

  }

  public deletePlayer(req: Request, res: Response) {
    const playerId = req.params.id;
    PlayerEntity.findByIdAndDelete(playerId, (error: Error, deleted: any) => {
      if (error) return res.send(error);
      const message = deleted ? 'deleted successfully' : 'player not found';
      // res.json({ message });
      res.send(message);
    });
  }

  public updatePlayer(req: Request, res: Response) {
    const playerId = req.params.id;
    PlayerEntity.findByIdAndUpdate(playerId, req.body, (error: Error, player: any) => {
      if (error) return res.send(error);
      const message = player ? 'updated succesfully' : 'pokemon not found';
      res.send(message);
    });
  }
}



  // normal function w/ callback
  // public getPlayer(req: Request, res: Response) {
  //   PlayerEntity.findById(req.params.id, (error: Error, player: MongooseDocument) => {
  //     if (error) return res.send(error);
  //     res.json(player);
  //   });
  // }

  // async-await with try/catch block
  // public async getPlayer(req: Request, res: Response) {
  //   try {
  //     const player = await PlayerEntity.findById(req.params.id);
  //     res.json(player);
  //   } catch(error) {
  //     res.send('furrrrh');
  //   }
  // }

  //.then .catch callbacks
  // public getPlayer(req: Request, res: Response) {
  //   PlayerEntity.findById(req.params.id)
  //     .then(p => {
  //       res.json(p);
  //     })
  //     .catch(err => {
  //       res.send('furrrrrrrrh');
  //     });
  // }
