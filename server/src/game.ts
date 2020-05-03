import { Request, Response } from "express";

export class Game {
    create(req: Request, res: Response) {
        res.send("Creation de la partie")

        
    }
}