import { Application } from 'express';
import OktaJwtVerifier from '@okta/jwt-verifier';

import { PlayerService } from './services/player.service';

export class Controller {
  private playerService: PlayerService;
  private jwt: any;

  constructor(private app: Application) {
    this.playerService = new PlayerService();
    this.routes();

    this.jwt = new OktaJwtVerifier({
      issuer: "https://dev-232123/oauth2/default"
    });
  }

  public authRequired(req: any, res: any, next: any) {

    next();
    return;
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
      res.status(401);
      //return next('Unauthorized!');
    }

    const accessToken = match[1];

    return this.jwt.verifyAccessToken(accessToken)
      .then((jwt: any) => {
        req.jwt = jwt;
        next();
      })
      .catch((err: any) => {
        res.status(401).send("donkey not connected");
      });

  }

  public routes() {
    this.app.route('/').get(this.playerService.welcomeMessage);

    this.app.route('/auth').get(this.authRequired, (req, res) => { res.json({m:'yes'}) });

    this.app.route('/players').get(this.playerService.getAllPlayers);
    this.app.route('/player').post(this.playerService.addNewPlayer);
    this.app.route('/player/:id').get(this.playerService.getPlayer);
    this.app.route("/player/:id").delete(this.playerService.deletePlayer);
    this.app.route('/player/:id').put(this.playerService.updatePlayer);
  }
}