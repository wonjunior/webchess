<template>
  <div class="games-list">
    <div class="games-list-header">Previous games</div>
    <div class="games-list-item" v-for="({white, black, result, date, pgn}, i) in games" :key="i">
      <img :src="resultIcon(white.id, result)" />
      {{white.name}} vs {{black.name}} <span style="font-size:75%">({{new Date(date).toLocaleDateString()}})</span>
      <img class="replay-icon" src="https://img.icons8.com/android/24/000000/visible.png"
           v-on:click="replay(white.name, black.name, pgn)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import Game from '../models/Game'

enum Icon {
  WON = 'https://img.icons8.com/android/24/000000/thumb-up.png',
  LOST = 'https://img.icons8.com/android/24/000000/thumbs-down.png',
  DRAW = 'https://img.icons8.com/android/24/000000/handshake.png',
}

@Component
export default class GamesList extends Vue {
  @Prop() playerId: string
  @Prop() games: Game[]

  resultIcon(whiteId: string, result: string) {
    const playerIsWhite = whiteId == this.playerId
    switch (result) {
      case 'w': return playerIsWhite ? Icon.WON : Icon.LOST
      case 'b': return playerIsWhite ? Icon.LOST : Icon.WON
      default: return Icon.DRAW
    }
  }

  replay(white: string, black: string, pgn: string) {
    this.$router.push({ name: 'replay', params: { white, black, pgn } })
  }
}

</script>


<style scoped>
.games-list {
  box-shadow: 0px 0px 4px black;
  text-align: left;
  border-radius: 5px;
  padding: 20px;
  padding-bottom: 15px;
  font-size: 15px;
  list-style-type: none;
  margin-top: 20px;
}
.games-list-header {
  margin: auto;
  text-align: center;
  margin-bottom: 15px;
  font-size: 20px;
}
.games-list-item {
  margin-bottom: 2px;
  font-size: 85%;
}
.games-list-item img {
  vertical-align: middle;
  width: 20px;
  margin-right: 5px;
}
.replay-icon {
  margin-left: 10px;
  float: right;
  cursor: pointer;
  transition: width .5s linear;
}
</style>