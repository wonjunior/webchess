<template>
  <div class="search-player">
    <div class="search-player-header">Search player</div>
    <div class="search-box"><input v-model="task" class="find-input" type="text" /><button v-on:click="searchPlayer" class="find-button">Find</button></div>
    <ul v-for="player in players" :key="player.id" class="search-result">
      <li class="search-result-item">
        <span class="search-result-label">{{ player.name }} <i>(elo {{ player.elo }})</i></span>
        <button v-on:click="addPlayer(player)">+</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'

import Player from '../models/Player'

@Component
export default class SearchPlayer extends Vue {
  task = ''
  players = [] as Player[]

  @Emit()
  async addPlayer(player: Player) {
    // <AJAX> PUT /friend/:id -> if response is true then return player to parent
    const i = this.players.indexOf(player)
    if (~i) this.players = this.players.splice(i, 0)
    return player
  }

  async searchPlayer() {
    // <AJAX> GET to /search with input as param
    const result = await (() => [{ id: 'f5z4gz6z8v4v12z', name: 'Jean', elo: 100 }, { id: 'd5eg8ze1ze3zef8', name: 'Jeanne', elo: 350 }, { id: 'sg45g1d2czs1e', name: 'Jeannot', elo: 340 }])()
    this.players = result
  }
}

</script>

<style>
.search-player {
  box-shadow: 0px 0px 4px black;
  text-align: left;
  border-radius: 5px;
  padding: 20px;
  padding-bottom: 15px;
  font-size: 20px;
  list-style-type: none;
}
.search-player-header {
  margin: auto;
  text-align: center;
  margin-bottom: 15px;
  font-size: 20px;
}
.search-box {
  text-align: center;
}
.search-box > * {
  display: inline-block;
  vertical-align: middle;
}
.find-input {
  height: 24px;
}
.find-button {
  line-height: 20px;
  cursor: pointer;
  font-family: 'Libre Baskerville', serif;
  font-size: 13px;
}
ul.search-result {
  list-style-type: none;
  padding: 0 25px;
  font-size: 15px;
}
.search-result-item button {
  float: right;
  width: 25px;
  height: 25px;
  text-align: center;
  padding: 0;
  margin: 0;
}
.search-result-label {
  vertical-align: middle;
}
.search-result-label i {
  font-size: 75%;
}
</style>