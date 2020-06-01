import { Socket } from 'socket.io'

import { Game } from '../../services/game'
import  PlayerController  from './player.controller'


export default class GameController {
  private games: Map<string, Game> = new Map()
  private players: Map<string, PlayerController> = new Map()

  public newPlayer(socket: Socket) {
    const player = new PlayerController(socket)
    this.players.set(socket.player.id, player)

    this.setupSocketListener(player)
  }

  private setupSocketListener(player: PlayerController) {
    player.receiveInvite(this)
    player.receiveConfirmation(this)
  }

  public invite(socket: Socket, opponent: string) {
    let player = this.players.get(socket.player.id)
    if(!player) return console.error('no connected player found with id', socket.player.id)

    const opponentPlayer = this.players.get(opponent)

    if(!opponentPlayer) return console.error('no connected player found with id', opponent)
    if(!opponentPlayer.available) return console.info('that player is not available: ', socket.player.id)

    player.opponent = opponent

    opponentPlayer.invite(player)
  }

  public async acceptInvitation(socket: Socket, opponent: string) {
    const player = this.players.get(socket.player.id)
    if(!player) return console.error('no connected player found with id', socket.player.id)

    const opponentPlayer = this.players.get(opponent)
    if(!opponentPlayer) return console.error('no connected player found with id', opponent)
    if(!opponentPlayer.available) return console.info('that player is not available: ', socket.player.id)
    if(opponentPlayer.opponent != socket.player.id) return console.info('that player has not invited you: ', opponent)

    player.opponent = opponentPlayer.id
    opponentPlayer.available = false
    player.available = false

    await this.newGame(opponentPlayer, player)
  }

  public async newGame(player1: PlayerController, player2: PlayerController) {
    const game = new Game()
    await game.create(player1, player2)

    this.games.set(game.id, game)
    console.info('A new game has been created with id:', game.id)
  }
}