<template>
  <div v-if="authenticated" class="home">
    <h2>Welcome back {{name}}</h2>
    <div class="body">
      <div class="side">
        <Friendslist :friends="friends" />
        <SearchPlayer @add-player="addPlayer" />
      </div>
      <div class="main">
        <PlayerStats :elo="elo" :wins="wins" :losses="losses" :previousElo="previousElo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import Friendslist from '@/components/FriendsList.vue'
import SearchPlayer from '@/components/SearchPlayer.vue'
import PlayerStats from '@/components/stats/PlayerStats.vue'

import Player from '../models/Player'
import Ajax from '../utils/Ajax'

@Component({
  components: { Friendslist, SearchPlayer, PlayerStats }
})
export default class App extends Vue {
  @Prop() authenticated: boolean
  name = ""
  friends = [] as Player[]
  wins = 0
  losses = 0
  elo = 1500
  previousElo = []

  async created() {
    const token = await this.$auth.getAccessToken()
    const player = await new Ajax(token).get('player')
    this.name = player.name || this.name
    this.elo = player.elo || this.elo
    this.wins = player.wins || this.wins
    this.losses = player.losses || this.losses
    this.previousElo = player.previous_elo || this.previousElo
    this.friends = await new Ajax(token).get('friends')
  }

  addPlayer(player: Player) {
    if (player) this.friends.push(player)
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
 margin-top: -9px;
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