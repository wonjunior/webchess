<template>
  <div>
    <div v-if="authenticated">
      <h2>Welcome back {{name}}</h2>
      <div class="body">
        <div class="side">
          <Friendslist @invite-player="inviteToPlay" :friends="friends" />
          <SearchPlayer @add-player="addPlayer" :ajax="ajax" />
          <GamesList :playerId="id" :games="games" />
        </div>
        <div class="main">
          <PlayerStats :elo="elo" :wins="wins" :losses="losses" :previousElo="previousElo" />
        </div>
      </div>
      <button v-on:click="redirectToGame">play game</button>
    </div>
    <div v-else>
       <div style="margin:50px">
         <h2>Welcome to WebChess, please login to play!</h2>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import Ajax from '../utils/Ajax'
import { WebChessSocket, SocketEmitMessage, SocketReceiveMessage } from '../services/WebChessSocket'

import Friendslist from '@/components/FriendsList.vue'
import SearchPlayer from '@/components/SearchPlayer.vue'
import GamesList from '@/components/GamesList.vue'
import PlayerStats from '@/components/stats/PlayerStats.vue'

import Player from '../models/Player'
import Game from '../models/Game'

@Component({
  components: { Friendslist, SearchPlayer, GamesList, PlayerStats }
})
export default class Home extends Vue {
  @Prop() authenticated: boolean
  @Prop() ajax: Ajax
  @Prop() socket: WebChessSocket

  id = ""
  name = ""
  friends = [] as Player[]
  wins = 0
  losses = 0
  elo = 1500
  previousElo = []
  games = [] as Game[]

  async mounted() {
    if (this.authenticated) this.getPlayer()
  }

  @Watch('authenticated')
  async getPlayer() {
    const player = await this.ajax.get('player')

    this.id = player._id
    this.name = player.name || this.name
    this.elo = player.elo || this.elo
    this.wins = player.wins || this.wins
    this.losses = player.losses || this.losses
    this.previousElo = player.previous_elo || this.previousElo
    this.games = player.games || this.games
    this.friends = await this.ajax.get('friends')
  }

  addPlayer(player: Player) {
    if (player) this.friends.push(player)
  }

  inviteToPlay(id: string) {
    console.log('emitting', SocketEmitMessage.INVITEPLAYER, 'with param', {id})
    this.socket.emit(SocketEmitMessage.INVITEPLAYER, { id });
  }

  redirectToGame() {
    this.$router.push({ name: 'play' })
  }
}

</script>

<style>
.side {
 width: 275px;
}
.side > * {
  margin-top: 10px;
  min-width: 220px;
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
  min-width: 500px;
  vertical-align: top;
  margin-top: 0;
}

@media only screen and (max-width: 1700px) {
  .main {
    margin-top: 20px;
    float: none;
    width: calc(100% - 275px - 20px + 100px);
  }
  .side {
    width: 100%;
  }
  .side > ul {
    margin-top: 0;
  }
  .side > div, .side > ul {
    display: inline-block;
    width: 32%;
    min-width: 220px;
    margin-right: 1%;
    margin-top: 0;
    vertical-align: top;
  }
}

@media only screen and (max-width: 1175px) {
  .side > div, .side > ul {
    display: block;
    width: 300px;
    margin: 10px auto 0 auto;
  }
}
</style>