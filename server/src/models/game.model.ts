import Ajax from "../utils/Ajax";
import { CHESS_API_ROOT } from '../config'

interface Move {
  from: string;
  to: string;
}

/**
 * Our source of truth is the 3rd party chess API
 * EDIT: this class is now UNUSED because the chess API is not available anymore, instead we use chess.js internally
 */
export default class GameModel {
  public id = ''

  private api = new Ajax(CHESS_API_ROOT)

  public async create() {
    const { status, game_id } = await this.api.get()
    this.id = game_id
    return { status }
  }

  public async gameState() {
    return await this.api.post('check', { game_id: this.id })
  }

  public async play({ from, to }: Move) {
    return await this.api.post('move', { from, to, game_id: this.id })
  }

  public async getFEN() {
    return await this.api.post('fen', { game_id: this.id })
  }

  public async getPGN() {
    return await this.api.post('pgn', { game_id: this.id })
  }
}