<template>
  <div class="stat">
    <div>Player progression:</div>
    <div class="average-elo">elo average ~ {{ averageElo }}</div>
    <svg class="elo-chart" :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`">
      <polyline fill="none" stroke="#df8695" stroke-width="3" :points="svgPreviousElo()" />
      <polyline fill="none" stroke="blue" stroke-width="2" stroke-dasharray="4" :points="svgAverageElo()" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class PlayerProgression extends Vue {
  @Prop() elos: number[]

  viewBoxWidth = 400
  viewBoxHeight = 100

  get averageElo(): number {
    return Math.round(this.elos.reduce((a,b) => a+b, 0) / (this.elos.length || 1))
  }

  svgPreviousElo() {
    return this.svgPolyline(this.elos)
  }

  svgAverageElo() {
    return this.svgPolyline(new Array(this.elos.length).fill(this.averageElo))
  }

  svgPolyline(values: number[]) {
    const [ min, max ] = [ Math.min(...this.elos), Math.max(...this.elos) ]
    const range = max - min
    return values.map((y, x) => `${x * this.viewBoxWidth / values.length},${(max - y) * this.viewBoxHeight / range}`).join(' ')
  }
}
</script>

<style>
.stat {
  margin-bottom: 20px;
}
.elo-chart {
  display: block;
  width: 75%;
  height: 200px;
  margin: 30px 20px 20px 50px;
  padding: 0;
  overflow: visible;
  border-left: 2px dotted #555;
  border-bottom: 2px dotted #555;
  background: white;
}
.average-elo {
  margin-left: 30px;
}
</style>