import { Application } from 'express';
import OktaJwtVerifier from '@okta/jwt-verifier';

import { PlayerService } from './services/player.service';
import { GameController } from './game';

export class Controller {
  private playerService: PlayerService;
  private jwtVerifier: any;
  private game = new GameController();

  constructor(private app: Application) {
    this.playerService = new PlayerService();
    this.routes();

    this.jwtVerifier = new OktaJwtVerifier({
      issuer: 'https://dev-232123.okta.com/oauth2/default',
      clientId: '0oaanm545S538wrmZ4x6',
      // assertClaims: {
      //   aud: 'api://default',
      // }
    });
  }

  public authRequired(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
      return res.json({message: 'no match'});
    }

    const accessToken = match[1];
    const expectedAudience = 'api://default';

    return this.jwtVerifier.verifyAccessToken(accessToken, expectedAudience)
      .then((jwt: any) => {
        req.jwt = jwt;
        res.json({ jwt })
        // next();
      })
      .catch((err: any) => {
        res.json({ error: err.message });
      });
  }

  public routes() {
    this.app.route('/').get(this.playerService.welcomeMessage);

    this.app.route('/auth').get(this.authRequired.bind(this), (req, res) => { res.json({m:'yes'}) });

    this.app.route('/game/create/:id').get(this.game.create);

    this.app.route('/players').get(this.playerService.getAllPlayers);
    this.app.route('/player').post(this.playerService.addNewPlayer);
    this.app.route('/player/:id').get(this.playerService.getPlayer);
    this.app.route("/player/:id").delete(this.playerService.deletePlayer);
    this.app.route('/player/:id').put(this.playerService.updatePlayer);
  }
}