import OktaJwtVerifier from '@okta/jwt-verifier'
import { Request, Response, NextFunction } from 'express'

import { WebChessError, oktaErrorHandling } from './Helpers'
import { OKTA_ISSUER, OKTA_CLIENT_ID, OKTA_EXPECTED_AUDIENCE } from '../config'
import { Socket } from 'socket.io'


/**
 * Middleware used to verify the request's JWT. If the user is
 * authenticated, its email address is returned.
 */
export default class Authenticator {
  jwtVerifier: any

  constructor() {
    this.jwtVerifier = new OktaJwtVerifier({
      issuer: OKTA_ISSUER,
      clientId: OKTA_CLIENT_ID,
    })
  }

  /**
   * Used in Express' middleware pipeline: verifies the request's authorization header. If the
   * operation is successful the player's id is stored inside the Request object and the next
   * middleware function is called.
   */
  async middleware(req: Request, res: Response, next: NextFunction): Promise<void | Response<any>> {
    const response = await this.verify(req.headers.authorization)

    if ((response as WebChessError).error) return res.json(response)

    req.email = response as string
    next()
  }

  /**
   * Used in Socket.io's middleware pipeline: verifies the request's authorization header. If the
   * operation is successful the player's id is stored inside the Request object and the next
   * middleware function is called.
   */
  async socketMiddleware(socket: Socket, next: any) {
    const { token } = socket.handshake.query || {};
    const response = await this.verify(token)

    if ((response as WebChessError).error) return console.log('(socket middleware) token verificaton failed')

    socket.email = response as string
    return next()
  }

  /**
   * Verifies the provided authorization string
   * @param authorization the request's authorization string
   */
  async verify(authorization = ''): Promise<string | WebChessError>  {
    const match = authorization.match(/Bearer (.+)/)

    if (!match) return { error: 'Request made without a JWT token' }

    const accessToken = match[1]

    return await this.jwtVerifier
      .verifyAccessToken(accessToken, OKTA_EXPECTED_AUDIENCE)
      .then((jwt: any) => jwt.claims.sub)
      .catch(oktaErrorHandling)
  }
}