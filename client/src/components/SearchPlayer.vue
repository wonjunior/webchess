<template>
  <div class="search-player">
    <div class="search-player-header">Search player</div>
    <div class="search-box"><input v-model="task" class="find-input" type="text" /><button v-on:click="findPlayer" class="find-button">Find</button></div>
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
  findPlayer() {
    return this.task
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
</style>