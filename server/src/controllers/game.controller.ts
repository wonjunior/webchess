import { Request, Response } from "express";

import { PlayerModel } from "../models/player.model"

export class GameController {
  public async saveGame(req: Request, res: Response) {
    res.json(await new PlayerModel(req.player).archiveGame(req.body.white, req.body.black, req.body.pgn, req.body.result))
  }
}