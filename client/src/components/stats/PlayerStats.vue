<template>
  <div class="stat-container">
    <WinRate :wins="wins" :losses="losses" />
    <div class="stat">
      <div>Elo rating:</div>
      <div class="player-elo">{{ elo }}</div>
    </div>
    <PlayerProgression :elos="previousElo" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import WinRate from '@/components/stats/WinRate.vue'
import PlayerProgression from '@/components/stats/PlayerProgression.vue'

@Component({
  components: { WinRate, PlayerProgression }
})
export default class PlayerStats extends Vue {
  @Prop() elo: number
  @Prop() wins: number
  @Prop() losses: number
  @Prop() previousElo: number[]
}

</script>

<style>
.stat-container {
  padding: 10px;
  padding-bottom: 0;
}
.stat > * {
  display: inline-block;
  vertical-align: middle;
}
.player-elo {
  font-size: 30px;
  font-weight: bold;
  margin-left: 20px;
}
</style>