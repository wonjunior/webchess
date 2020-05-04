import { Request, Response } from "express";

export class GameController {
    create(req: Request, res: Response) {
        res.send("Creation de la partie")

        
    }
}