<template>
  <div class="stat">
    <div >Win rate:</div>
    <div class="win-loss-bar">
      <div class="bar-left" :style="`width:${winRate}%`">{{ Math.round(winRate) }}%</div>
      <div class="bar-right">{{ 100 - Math.round(winRate) }}%</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class WinRate extends Vue {
  @Prop() wins: number
  @Prop(Number) losses: number

  get winRate(): number {
    return (this.wins / (this.losses + this.wins) * 100) || 50
  }
}

</script>

<style>
.stat {
  margin-bottom: 20px;
}
.win-loss-bar {
  margin-left: 20px;
  height: 25px;
  width: 400px;
  border: 2px solid lightgrey;
}
.bar-left, .bar-right {
  height: 100%;
  text-align: center;
  font-size: 18px;
}
.bar-left {
  float: left;
  background: lightgreen;
}
.bar-right {
  background: #f55555;
  width: 100%
}
</style>