import { Chess } from 'chess.js'
import { Socket } from 'socket.io'

import { Game, Color, ChessResult } from '../../services/game'
import  PlayerController  from './player.controller'


export default class GameController {
  private games: Map<string, Game> = new Map()
  private players: Map<string, PlayerController> = new Map()

  public newPlayer(socket: Socket) {
    const player = new PlayerController(socket)
    console.log('New player connected: ' + player.player.name + '(' + player.id + ')')
    this.players.set(socket.player.id, player)

    this.setupSocketListener(player)
  }

  public deleteGame(id: string){
    this.games.delete(id)
  }
  
  public deletePlayer(player_id: string) {
    this.players.delete(player_id)
  }

  private setupSocketListener(player: PlayerController) {
    player.receiveInvite(this)
    player.receiveConfirmation(this)
    player.onDisconnect(this)
    player.onQuitGame(this)
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

  public acceptInvitation(socket: Socket, opponent: string) {
    const player = this.players.get(socket.player.id)
    if(!player) return console.error('no connected player found with id', socket.player.id)

    const opponentPlayer = this.players.get(opponent)
    if(!opponentPlayer) return console.error('no connected player found with id', opponent)
    if(!opponentPlayer.available) return console.info('that player is not available: ', socket.player.id)
    if(opponentPlayer.opponent != socket.player.id) return console.info('that player has not invited you: ', opponent)

    player.opponent = opponentPlayer.id
    opponentPlayer.available = false
    player.available = false

    this.newGame(opponentPlayer, player)
  }

  public newGame(player1: PlayerController, player2: PlayerController) {
    const game = new Game(this)
    game.create(player1, player2)
    player1.startGame()
    player2.startGame()
    this.games.set(game.id, game)
    console.info('A new game has been created with id:', game.id)
  }

  public quitGame(game_id: string, loserColor: Color) {
    const game = this.games.get(game_id)
    if(!game) return console.error('no game found with id', game_id)

    if (loserColor == Color.BLACK)
      game.endGame(ChessResult.WHITE_WON)
    else 
      game.endGame(ChessResult.BLACK_WON)
  }
}