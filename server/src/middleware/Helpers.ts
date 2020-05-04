import { Request } from 'express'

import { Player } from '../schemas/player.schema'

export interface WebChessError {
  error: string
}

export function databaseErrorHandling(error: any) {
  console.error(error)
  return { error: 'An error occured with the database of the server' }
}