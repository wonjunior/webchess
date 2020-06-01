import { Socket } from 'socket.io'

import { Game } from '../../services/game'
import  PlayerController  from './player.controller'


export default class GameController {
  private games: Map<string, Game> = new Map()
  private players: Map<string, PlayerController> = new Map()

  public newPlayer(socket: Socket) {
    const player = new PlayerController(socket)
    this.players.set(socket.player.id, player)
  }

  public invite(socket: Socket, opponent: string) {
    let player = this.players.get(socket.player.id)
    if(!player) return console.error('no connected player found with id', socket.player.id)

    const opponentPlayer = this.players.get(opponent)
    if(!opponentPlayer) return console.error('no connected player found with id', opponent)
    if(!opponentPlayer.disponible) return console.info('that player is not disponible: ', socket.player.id)

    player.disponible = false
    player.opponent = opponent
    this.players.set(socket.player.id, player)

    opponentPlayer.invite(player)
  }
  
  public async acceptInvitation(socket: Socket, opponent: string) {
    let player = this.players.get(socket.player.id)
    if(!player) return console.error('no connected player found with id', socket.player.id)

    const opponentPlayer = this.players.get(opponent)
    if(!opponentPlayer) return console.error('no connected player found with id', opponent)
    if(!opponentPlayer.disponible) return console.info('that player is not disponible: ', socket.player.id)
    if(opponentPlayer.opponent != socket.player.id) return console.info('that player has not invited you: ', opponent)

    player.disponible = false
    this.players.set(socket.player.id, player)

    await this.newGame(opponentPlayer, player)
  }

  public async newGame(player1: PlayerController, player2: PlayerController) {
    const game = new Game()
    await game.create(player1, player2)

    this.games.set(game.id, game)
    console.info('A new game has been created with id:', game.id)
  }

}