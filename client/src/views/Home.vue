<template>
  <div class="home">
    <h2>Welcome back {{name}}</h2>
    <div class="body">
      <div class="side">
        <Friendslist :friends="friends" @findPlayer="findPlayer" />
        <SearchPlayer @find-player="findPlayer" />
      </div>
      <div class="main">
        <PlayerStats :elo="elo" :wins="wins" :losses="losses" :previousElo="previousElo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Friendslist from '@/components/FriendsList.vue'
import SearchPlayer from '@/components/SearchPlayer.vue'
import PlayerStats from '@/components/stats/PlayerStats.vue'

import Player from '../models/Player'
@Component({
  components: { Friendslist, SearchPlayer, PlayerStats }
})
export default class App extends Vue {
  name = 'Jean-Claude Van Damme'
  friends = [
    { id: 'fkjzenf5161qfq65', name: 'Lucas', elo: 100 },
    { id: 'fkznfezj6545zf4zef', name: 'Sophie', elo: 203 },
    { id: '5fd4zf1efez31zeff', name: 'Ronan', elo: 50 }
  ]
  wins = 20
  losses = 10
  elo = 410
  previousElo = [ 510, 505, 515, 526, 540, 437, 416, 700, 500 ]

  findPlayer(player: string) {
    console.log(player)
  }
}

</script>

<style>
.home {
  width: 50%;
  margin: 20px auto;
}
.body, .home h2 {
  font-family: 'Libre Baskerville', serif;
}
.body > * {
  display: inline-block
}
.side {
 width: 275px;
 padding-top: 50px;
}
.main {
  width: calc(100% - 275px - 20px);
  box-shadow: 0px 0px 4px black;
  text-align: left;
  border-radius: 5px;
  padding: 30px;
  font-size: 20px;
  list-style-type: none;
  margin: 10px;
  float: right;
}
</style>