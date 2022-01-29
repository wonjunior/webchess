<template>
<div>
    <div id="infos">

      <template v-if="inGame || showResults">
          <h3>{{ getGameStateString() }}</h3>

          <div v-bind:class="getPlayerStyle('w')">
            <img class="player-el" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjZNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTIyLjUgMjVzNC41LTcuNSAzLTEwLjVjMCAwLTEtMi41LTMtMi41cy0zIDIuNS0zIDIuNWMtMS41IDMgMyAxMC41IDMgMTAuNSIgZmlsbD0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMTEuNSAzN2M1LjUgMy41IDE1LjUgMy41IDIxIDB2LTdzOS00LjUgNi0xMC41Yy00LTYuNS0xMy41LTMuNS0xNiA0VjI3di0zLjVjLTMuNS03LjUtMTMtMTAuNS0xNi00LTMgNiA1IDEwIDUgMTBWMzd6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTExLjUgMzBjNS41LTMgMTUuNS0zIDIxIDBtLTIxIDMuNWM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwIi8+PC9nPjwvc3ZnPg=="/>
            <span v-if="showResults" class="player-el">{{ whiteName }} ({{ whiteElo }} {{whiteEloDiff >= 0 ? '+' : '-'}} {{ Math.abs(whiteEloDiff) }})</span>
            <span v-else class="player-el">{{ whiteName }} ({{ whiteElo }})</span>
          </div>

          <div v-bind:class="getPlayerStyle('b')">
            <img class="player-el" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjYiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjIuNSAyNXM0LjUtNy41IDMtMTAuNWMwIDAtMS0yLjUtMy0yLjVzLTMgMi41LTMgMi41Yy0xLjUgMyAzIDEwLjUgMyAxMC41IiBmaWxsPSIjMDAwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0xMS41IDM3YzUuNSAzLjUgMTUuNSAzLjUgMjEgMHYtN3M5LTQuNSA2LTEwLjVjLTQtNi41LTEzLjUtMy41LTE2IDRWMjd2LTMuNWMtMy41LTcuNS0xMy0xMC41LTE2LTQtMyA2IDUgMTAgNSAxMFYzN3oiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMyIDI5LjVzOC41LTQgNi4wMy05LjY1QzM0LjE1IDE0IDI1IDE4IDIyLjUgMjQuNWwuMDEgMi4xLS4wMS0yLjFDMjAgMTggOS45MDYgMTQgNi45OTcgMTkuODVjLTIuNDk3IDUuNjUgNC44NTMgOSA0Ljg1MyA5IiBzdHJva2U9IiNlY2VjZWMiLz48cGF0aCBkPSJNMTEuNSAzMGM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwbS0yMSAzLjVjNS41LTMgMTUuNS0zIDIxIDAiIHN0cm9rZT0iI2VjZWNlYyIvPjwvZz48L3N2Zz4="/>
            <span v-if="showResults" class="player-el">{{ blackName }} ({{ blackElo }} {{whiteEloDiff >= 0 ? '-' : '+'}} {{ Math.abs(whiteEloDiff) }})</span>
            <span v-else class="player-el">{{ blackName }} ({{ blackElo }})</span>
          </div>

          <button v-if="inGame" v-on:click="quitGame()"> Quit game </button>

      </template>


      <p v-else>Not connected to game</p>
      
      <div id="board" ref="board"></div>
      
    </div>
    
  </div>
  
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import { WebChessSocket, SocketEmitMessage, SocketReceiveMessage, StartMsg, EndMsg, ChessResult } from '../services/WebChessSocket'
import Ajax from '../services/Ajax'

import { Chessboard as cmChessboard, MOVE_INPUT_MODE, INPUT_EVENT_TYPE } from 'cm-chessboard'

interface Move {
  type: string;
  squareFrom: string;
  squareTo: string;
}
enum Color {
  Black = 'b',
  White = 'w'
}

@Component
export default class Chessboard extends Vue {
  @Prop() authenticated: boolean
  @Prop() ajax: Ajax
  @Prop() socket: WebChessSocket 

  // eslint-disable-next-line
  private board: any
  private color = ''
  private inGame = false
  private showResults = false
  private whiteName = ""
  private blackName = ""
  private whiteElo = 0
  private blackElo = 0
  private whiteEloDiff = 0
  private result = ChessResult.DRAW
  private turn = Color.White

  async mounted() {
    if (!this.authenticated) return this.$router.push({ name: 'home' });
    this.onceAuthenticated()
  }

  private onceAuthenticated() {
    this.setBoard()
    this.setUpSocket()
  }

  //get css style for player
  private getPlayerStyle (playerColor: string) {
    let className = "player "

    //if we show results and player won
    if(this.showResults && (
      (playerColor === 'b' && this.result == ChessResult.BLACK_WON)
      || (playerColor === 'w' && this.result == ChessResult.WHITE_WON) 
    )) {
      className += "winner "
    }

    //if player is in game and it's his turn
    else if (this.inGame && this.turn == playerColor) {
      className += "my-turn "
    }
    return className
  }

  //return a string describing game state
  private getGameStateString() {
    if (this.inGame) {
     if(this.turn == Color.Black) {
       return this.color == 'b' ? "It's your turn, " + this.blackName + " !" : this.blackName + " is playing ..."
     }
     else {
       return this.color == 'w' ? "It's your turn, " + this.whiteName + " !" : this.whiteName + " is playing ..."
     }
    }
    else {
       if(this.result == ChessResult.BLACK_WON){
      return this.blackName + " won !"
    }
    else if (this.result == ChessResult.WHITE_WON){
      return this.whiteName + " won !"
    }
    else 
      return "Draw game."
    }
  }

  private setUpSocket() {
    this.socket.on(SocketReceiveMessage.YOURTURN, (state: string) => {
      console.log('My turn!', state)
      this.board.setPosition(state)
      this.turn = this.color == 'w' ? Color.White : Color.Black
      // this.board.setFEN(state)
    })
    this.socket.on(SocketReceiveMessage.INVALIDATE, (state: string) => {
      console.log('Invalid move! reseting to ', state)
      this.board.setPosition(state)
      // this.setBoard(state)
    })
    this.socket.on(SocketReceiveMessage.VALIDATE, () => {
      this.turn = this.color == 'w' ? Color.Black : Color.White
    })
    this.socket.on(SocketReceiveMessage.START, (msg: StartMsg) => {
      this.whiteName = msg.white
      this.whiteElo = msg.white_elo
      this.blackName = msg.black
      this.blackElo = msg.black_elo
      this.inGame = true
      this.showResults = false
      console.log('Game start')   
    })
    this.socket.on(SocketReceiveMessage.ENDGAME, (msg: EndMsg) => {
      this.result = msg.result
      this.whiteEloDiff = msg.white_elo_diff
      this.inGame = false
      this.showResults = true
      console.log('Game end')
    })
  }

  private quitGame() {
    if(!this.authenticated) return
    this.socket.emit(SocketEmitMessage.QUIT, {})
    //this.$router.push({ name: 'home' })
  }

  private setBoard() {
    this.color = this.$route.params.color
    this.board = new cmChessboard(this.$refs.board, {
      position: "start",
      moveInputMode: MOVE_INPUT_MODE.dragPiece,
      sprite: { url: "./chessboard-sprite.svg" }
    })

    this.board.enableMoveInput((event: Move) => {
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
          return true
        case INPUT_EVENT_TYPE.moveDone:
          console.log('Send move')
          this.socket.emit(SocketEmitMessage.MOVE, { from: event.squareFrom, to: event.squareTo })
          return true
        case INPUT_EVENT_TYPE.moveCanceled:
          return null
      }
    })
  }
}

import 'cm-chessboard/styles/cm-chessboard.css'
</script>

<style>
#board {
  max-width: 450px;
  max-height: 430px;
  width: calc(100vw - 40px);
  height: calc(95vw - 40px);
}
.player {
  display: flex;
  width: 450px;
  justify-content: flex-start;
}
.winner {
  border-width: 2px;
  border-color: greenyellow;
  border-style: solid;
}
.my-turn {
  border-width: 2px;
  border-color: black;
  border-style: solid;
}
.player-el:nth-child(2){
  flex-grow: 1;
  text-align: left;
  margin-left: 20px;
}
#infos>*{
  margin-bottom: 5px;
}
#infos {
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

}


</style>