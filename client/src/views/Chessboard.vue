<template>
  <div>
    <h3>Playing {{ color == 'w' ? 'white' : 'black' }}</h3>
    <div id="board"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import { WebChessSocket, SocketEmitMessage, SocketReceiveMessage } from '../services/WebChessSocket'
import Ajax from '../services/Ajax'

import { Chessboard as cmChessboard, MOVE_INPUT_MODE, INPUT_EVENT_TYPE } from 'cm-chessboard'

interface Move {
  type: string;
  squareFrom: string;
  squareTo: string;
}

@Component
export default class Chessboard extends Vue {
  @Prop() authenticated: boolean
  @Prop() ajax: Ajax
  @Prop() socket: WebChessSocket

  // eslint-disable-next-line
  private board: any
  private color = ''

  async mounted() {
    if (!this.authenticated) return this.$router.push({ name: 'home' });
    this.onceAuthenticated()
  }

  private onceAuthenticated() {
    this.setBoard()
    this.setUpSocket()
  }

  private setUpSocket() {
    this.socket.on(SocketReceiveMessage.YOURTURN, (state: string) => {
      console.log('My turn!', state)
      this.board.setPosition(state)
      // this.board.setFEN(state)
    })
    this.socket.on(SocketReceiveMessage.INVALIDATE, (state: string) => {
      console.log('Invalid move! reseting to ', state)
      this.board.setPosition(state)
      // this.setBoard(state)
    })
  }

  private setBoard() {
    this.color = this.$route.params.color
    this.board = new cmChessboard(this.$el.lastChild, {
      position: "start",
      moveInputMode: MOVE_INPUT_MODE.dragPiece,
      sprite: { url: "./chessboard-sprite.svg" }
    })

    this.board.enableMoveInput((event: Move) => {
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
          return true
        case INPUT_EVENT_TYPE.moveDone:
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
  margin: auto
}
</style>