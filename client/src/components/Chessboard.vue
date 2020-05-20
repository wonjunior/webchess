<template>
  <div id="board"></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import AbChess from '@/assets/abchess/AbChess.js'
import io from 'socket.io-client'

@Component
export default class Chessboard extends Vue {
  // eslint-disable-next-line
  private board: any
  message = ""
  socket = io(process.env.VUE_APP_BACKEND_ROOT, { query: {gameId: prompt("Entrez le num de la partie") }})


  mounted() {
    this.socket.on('yourTurn', (state: any) => {
      console.log('My turn !')
      this.board.setFEN(state)
    })
    this.board = new AbChess(this.$el.id, { animated: false })
    this.board.setFEN()
    this.board.onMovePlayed((move: any) => {
      this.socket.emit("move", { from: move.start, to: move.end});
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