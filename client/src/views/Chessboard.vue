<template>
  <div id="board"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import { WebChessSocket, SocketEmitMessage, SocketReceiveMessage } from '../services/WebChessSocket'
import Ajax from '../utils/Ajax'

import AbChess from '@/assets/abchess/AbChess.js'
// import io from 'socket.io-client'
// import { Socket } from 'socket.io-client'

interface Move {
  start: string;
  end: string;
}

@Component
export default class Chessboard extends Vue {
  @Prop() authenticated: boolean
  @Prop() ajax: Ajax
  @Prop() socket: WebChessSocket

  // eslint-disable-next-line
  private board: any

  async mounted() {
    if (!this.authenticated) return this.$router.push({ name: 'home' });
    this.setUpSocket()
  }

  setUpSocket() {
    this.socket.emit(SocketEmitMessage.MOVE, {})
    // const gameId = prompt("game id")
    this.setBoard()
    this.socket.on(SocketReceiveMessage.YOURTURN, (state: string) => {
      console.log('My turn!', state)
      this.board.setFEN(state)
    })
    this.socket.on(SocketReceiveMessage.INVALIDATE, (state: string) => {
      console.log('Invalid move! reseting to ', state)
      this.setBoard(state)
    })
  }

  setBoard(state = '') {
    this.$el.innerHTML = '';
    this.board = new AbChess(this.$el.id, { animated: false })
    state ? this.board.setFEN(state) : this.board.setFEN()
    this.board.onMovePlayed((move: Move) => {
      this.socket.emit(SocketEmitMessage.MOVE, { from: move.start, to: move.end});
    })
  }
}

</script>

<style src="@/assets/abchess/AbChess.css"></style>

<style>
#board {
  display: inline-block;
  margin-top: 20px;
}
</style>