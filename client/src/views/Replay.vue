<template>
  <div>
    <div class="replay-header">Replaying {{white}} (w) vs {{black}} (b)</div>
    <div class="side">
      <div class="replay-commands">
        <img v-on:click="navigate(0)" src="https://img.icons8.com/material-sharp/100/000000/double-left.png" />
        <img v-on:click="navigate(currentIndex-1)" src="https://img.icons8.com/material-sharp/96/000000/chevron-left.png" />
        <img v-on:click="navigate(currentIndex+1)" src="https://img.icons8.com/material-sharp/96/000000/chevron-right.png" />
        <img v-on:click="navigate(lastIndex)" src="https://img.icons8.com/material-sharp/100/000000/double-right.png" />
      </div>
      <div class="moves-list">
        <div class="move-number" v-for="(move, i) in playedMoves" :key=i>
          <div class="move-index">{{i+1}}</div>
          <div :class="currentIndex-1 == 2*i ? 'current-move' : ''">{{ move[0] }}</div>
          <div :class="currentIndex-1 == 2*i+1 ? 'current-move' : ''">{{ move[1] }}</div>
        </div>
      </div>
    </div>
    <div class="main">
      <div id="board"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AbChess from '@/assets/abchess/AbChess.js'

@Component
export default class Replay extends Vue {
  white = ''
  black = ''
  pgn = ''

  // eslint-disable-next-line
  private board: any

  private currentIndex: number
  private lastIndex: number
  private moves = [] as string[]
  private playedMoves = [] as string[][]

  mounted() {
    if (!this.$route.params.white) return this.$router.push({ name: 'home' })
    this.white = this.$route.params.white
    this.black = this.$route.params.black
    this.pgn = this.$route.params.pgn

    this.board = new AbChess('board', { clickable: false, draggable: false, animated: true })
    this.board.setPGN(this.pgn)
    this.moves = this.board.getMovesPGN()
    this.lastIndex = this.moves.length;
    this.navigate(0);
  }

  navigate(index: number) {
    if (index < 0 || index > this.lastIndex) return null
    this.currentIndex = index
    this.updateBoard()
    this.updateMoveHistory()
  }

  updateMoveHistory() {
    this.playedMoves = []
    const playedMoves = this.moves.slice(0, this.currentIndex)
    for (let i = 0; i < playedMoves.length; i += 2) {
      this.playedMoves.push([playedMoves[i], playedMoves[i+1] || '_'])
    }
  }

  updateBoard() {
    this.board.view(this.currentIndex)
  }
}

</script>

<style src="@/assets/abchess/AbChess.css"></style>

<style scoped>
#board {
  display: inline-block;
  margin-top: 20px;
}
.replay-header {
  font-size: 20px;
  margin-bottom: 15px;
  margin-top: 30px;
}
.side {
  float: right;
  width: 275px;
  box-shadow: 0px 0px 4px black;
  padding: 10px 0;
  border-radius: 2px;
}
.main {
  text-align: center;
}

.replay-commands {
  margin: 10px 0;
  margin-bottom: 20px;
  text-align: center;
}
.replay-commands img {
  width: 15%;
  cursor: pointer;
  user-select: none;
}

.moves-list {
  border-top: 2px solid black;
  margin: 0 10px;
}

.move-number div {
  cursor: pointer;
  display: inline-block;
  vertical-align: top;
  width: 40%;
  border-bottom: 1px gainsboro solid;
  border-right: 1px gainsboro solid;
  text-align: center;
  color: grey;
}
.move-number div:hover {
  background-color: gainsboro;
}
.move-index {
  width: 20% !important;
  background-color: white !important;
  cursor: auto !important;
}
.current-move {
  color: green;
  background-color: palegreen;
}
</style>