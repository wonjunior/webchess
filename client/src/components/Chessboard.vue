<template>
  <div id="board"></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import AbChess from '@/assets/abchess/AbChess.js'

@Component
export default class Chessboard extends Vue {
  // eslint-disable-next-line
  private board: any

  mounted() {
    this.board = new AbChess(this.$el.id, { animated: false })
    this.board.setFEN()
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