<template>
  <div class="home">
    <h2>Welcome back {{name}}</h2>
    <div class="body">
      <div class="side">
        <ul class="friend-list"><div class="friend-list-header">Friends list</div>
          <li v-for="{id, name, elo} in friends" :key="id">
            <div class="friend">
              <img src="https://img.icons8.com/metro/26/000000/human-head.png"/>{{ name }}
              <span class="friend-elo">elo {{ elo }}</span>
              <button>invite</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="main">
        <div class="stat-container">
          <div class="stat">
            <div >Win rate:</div>
            <div class="win-loss-bar">
              <div class="bar-left" :style="`width:${winRate}%`">{{ Math.round(winRate) }}%</div>
              <div class="bar-right">{{ 100-Math.round(winRate) }}%</div>
            </div>
          </div>
          <div class="stat">
            <div>Elo rating:</div>
            <div class="player-elo">{{ elo }}</div>
          </div>
          <div class="stat">
            <div>Player progression:</div>
            <div class="average-elo">elo average ~ {{ averageElo }}</div>
            <svg :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`" class="elo-chart">
              <polyline fill="none" stroke="#df8695" stroke-width="3" :points="svgPreviousElo()" />
              <polyline fill="none" stroke="blue" stroke-width="2" stroke-dasharray="4" :points="svgAverageElo()" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
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
  previous_elo = [ 510, 505, 515, 526, 540, 437, 416, 700, 500 ]

  viewBoxWidth = 400
  viewBoxHeight = 100

  get winRate(): number {
    return this.wins / (this.losses + this.wins) * 100
  }

  get averageElo(): number {
    return Math.round(this.previous_elo.reduce((a,b) => a+b) / (this.previous_elo.length || 1))
  }

  svgPreviousElo() {
    return this.svgPolyline(this.previous_elo)
  }

  svgAverageElo() {
    return this.svgPolyline(new Array(this.previous_elo.length).fill(this.averageElo))
  }

  svgPolyline(values: number[]) {
    const [ min, max ] = [ Math.min(...this.previous_elo), Math.max(...this.previous_elo) ]
    const range = max - min
    return values.map((y, x) => `${x * this.viewBoxWidth / values.length},${(max - y) * this.viewBoxHeight / range}`).join(' ')
  }
}
</script>

<style>

.home {
  width: 50%;
  margin: 20px auto;
}
.home > h2 {
  font-family: 'Libre Baskerville', serif;
}
.body {
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
.stat > div {
  display: inline-block;
}
.stat {
  margin-bottom: 20px;

}
.stat > * {
  vertical-align: middle;
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
.player-elo {
  font-size: 30px;
  font-weight: bold;
  margin-left: 20px;
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
ul.friend-list {
  box-shadow: 0px 0px 4px black;
  text-align: left;
  border-radius: 5px;
  padding: 20px;
  padding-bottom: 15px;
  font-size: 20px;
  list-style-type: none;
}

.friend-list > li {
  margin-bottom: 5px;
}

.friend-list-header {
  margin: auto;
  text-align: center;
  margin-bottom: 15px;
  font-size: 20px;
}

/* Tooltip container */
.friend {
  position: relative;
  display: inline-block;
  width: 100%;
}

.friend > img {
  width: 20px;
  margin-right: 5px;
}

.friend > button {
  line-height: 20px;
  float: right;
  cursor: pointer;
  font-family: 'Libre Baskerville', serif;
  font-size: 10px;
}

/* Tooltip text */
.friend .friend-elo {
  visibility: hidden;
  position: absolute;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  z-index: 1;
  font-size: 13px;
  line-height: 13px;
  bottom: auto;
  right: 105%;
}
/* Show the tooltip text when you mouse over the tooltip container */
.friend:hover .friend-elo {
  visibility: visible;
}

.friend-elo::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent #555;
}
</style>