import { Request } from 'express'
import { Socket } from 'socket.io'

import { Player } from '../schemas/player.schema'

export interface WebChessError {
  error: string
}

export function databaseErrorHandling(error: any) {
  console.error(error)
  return { error: 'An error occured with the database of the server' }
}

export function oktaErrorHandling(error: any) {
  console.error('[Okta error]' + error.message)
  return { error: 'Authentication failed, token not valid' }
}