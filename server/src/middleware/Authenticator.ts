import OktaJwtVerifier from '@okta/jwt-verifier'
import { Request, Response, NextFunction } from 'express'

import { WebChessError } from './Helpers'
import { OKTA_ISSUER, OKTA_CLIENT_ID, OKTA_EXPECTED_AUDIENCE } from '../config'

/**
 * Middleware used to verify the request's JWT. If the operation is
 * successful the player's id is stored inside the Request object
 * and the next middleware function is called
 */
export default class Authenticator {
  jwtVerifier: any

  constructor() {
    this.jwtVerifier = new OktaJwtVerifier({
      issuer: OKTA_ISSUER,
      clientId: OKTA_CLIENT_ID,
    })
  }

  async call(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || ''
    const match = authHeader.match(/Bearer (.+)/)

    if (!match) return res.json({ error: 'Request made without a JWT token' })

    const accessToken = match[1]

    const response = await this.jwtVerifier
      .verifyAccessToken(accessToken, OKTA_EXPECTED_AUDIENCE)
      .then((jwt: any) => jwt.claims.sub)
      .catch((error: any) => {
        console.error('[Okta error]' + error.message)
        return { error: 'Authentication failed, token not valid' }
      })

    if ((response as WebChessError).error) return res.json(response)

    req.email = response as string
    next()
  }
}