<template>
  <div class="search-player">
    <div class="search-player-header">Search player</div>
    <div class="search-box"><input v-model="input" class="find-input" type="text" /><button v-on:click="searchPlayer" class="find-button">Find</button></div>
    <ul v-for="player in players" :key="player.id" class="search-result">
      <li class="search-result-item">
        <span class="search-result-label">{{ player.name }} <i>(elo {{ player.elo }})</i></span>
        <button v-on:click="addPlayer(player)">+</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'

import Player from '../models/Player'
import Ajax from '../utils/Ajax'

@Component
export default class SearchPlayer extends Vue {
  @Prop() ajax: Ajax

  input = ''
  players = [] as Player[]

  @Emit()
  async addPlayer(player: Player) {
    const response = await this.ajax.post(`friend/${player.id}`)
    if (response.error) return console.error(response.error)

    this.players = []
    return player
  }

  async searchPlayer() {
    if (!this.input) return null

    const response = await this.ajax.get(`player/search/${this.input}`)
    if (response.error) return console.error(response.error)

    this.players = response
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
  cursor: pointer;
}
.search-result-label {
  vertical-align: middle;
}
.search-result-label i {
  font-size: 75%;
}
</style>