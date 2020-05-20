<template>
  <div v-if="authenticated">
    <h2>Welcome back {{name}}</h2>
    <div class="body">
      <div class="side">
        <Friendslist :friends="friends" />
        <SearchPlayer @add-player="addPlayer" />
        <GamesList :playerId="id" :games="games" />
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
import GamesList from '@/components/GamesList.vue'
import PlayerStats from '@/components/stats/PlayerStats.vue'

import Player from '../models/Player'
import Game from '../models/Game'
import Ajax from '../utils/Ajax'

@Component({
  components: { Friendslist, SearchPlayer, GamesList, PlayerStats }
})
export default class Home extends Vue {
  @Prop() authenticated: boolean

  id = ""
  name = ""
  friends = [] as Player[]
  wins = 0
  losses = 0
  elo = 1500
  previousElo = []
  games = [] as Game[]

  async created() {
    const token = await this.$auth.getAccessToken()

    const player = await new Ajax(token).get('player')
    console.log(player)
    this.id = player._id
    this.name = player.name || this.name
    this.elo = player.elo || this.elo
    this.wins = player.wins || this.wins
    this.losses = player.losses || this.losses
    this.previousElo = player.previous_elo || this.previousElo
    this.games = player.games || this.games
    this.friends = await new Ajax(token).get('friends')

    // console.log(await new Ajax(token).put('game/save', {
    //   white: {name: 'Jean', id: '5eadaee8ca2ddc0894ae3907' },
    //   black: {name: 'Mack', id: '5eac5eb54f67c30b9c66cc73'},
    //   pgn: '[Event "Sochi 28th RSFSR ch"] [Site "Sochi 28th RSFSR ch"] [Date "1958.??.??"] [Round "?"] [Result "0-1"] [White "Lev Polugaevsky"] [Black "Rashid Gibiatovich Nezhmetdinov"] [ECO "A54"] 1. d4 Nf6 2. c4 d6 3. Nc3 e5 4. e4 exd4 5. Qxd4 Nc6 6. Qd2 g6 7. b3 Bg7 8. Bb2 O-O 9. Bd3 Ng4 10. Nge2 Qh4 11. Ng3 Nge5 12. O-O f5 13. f3 Bh6 14. Qd1 f4 15. Nge2 g5 16. Nd5 g4 17. g3 fxg3 18. hxg3 Qh3 19. f4 Be6 20. Bc2 Rf7 21. Kf2 Qh2+ 22. Ke3 Bxd5 23. cxd5 Nb4 24. Rh1 Rxf4 25. Rxh2 Rf3+ 26. Kd4 Bg7 27. a4 c5+ 28. dxc6 bxc6 29. Bd3 Nexd3+ 30. Kc4 d5+ 31. exd5 cxd5+ 32. Kb5 Rb8+ 33. Ka5 Nc6+ 0-1',
    //   result: 'w'
    // }))
  }

  addPlayer(player: Player) {
    if (player) this.friends.push(player)
  }
}

</script>

<style>
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