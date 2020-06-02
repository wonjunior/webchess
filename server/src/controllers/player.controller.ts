import { Request, Response } from "express";

import { PlayerModel } from "../models/player.model"

export class PlayerController {
  public async getAllPlayers(req: Request, res: Response) {
    res.json(await PlayerModel.all())
  }

  public async searchPlayers(req: Request, res: Response) {
    res.json(await new PlayerModel(req.player).search(req.params.input))
  }

  public async getPlayer(req: Request, res: Response) {
    res.json(req.player)
  }

  public async createPlayer(req: Request, res: Response) {
    res.json(await new PlayerModel(req.player).create(req.email, req.body.name))
  }

  public async updatePlayer(req: Request, res: Response) {
    res.json(await new PlayerModel(req.player).update(req.email, req.body.name))
  }

  public async deletePlayer(req: Request, res: Response) {
    res.json(await new PlayerModel(req.player).delete(req.email))
  }

  // Friends
  public async addFriend(req: Request, res: Response) {
    res.json(await new PlayerModel(req.player).addFriend(req.params.id))
  }

  public async deleteFriend(req: Request, res: Response) {
    res.json(await new PlayerModel(req.player).deleteFriend(req.params.id))
  }

  public async getFriends(req: Request, res: Response) {
    res.json(await new PlayerModel(req.player).getFriends())
  }
}