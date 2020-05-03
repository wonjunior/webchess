<template>
  <ul class="friend-list">
    <div class="friend-list-header">Friends list</div>
    <li v-for="{id, name, elo} in friends" :key="id">
      <div class="friend">
        <img src="https://img.icons8.com/metro/26/000000/human-head.png"/>{{ name }}
        <span class="friend-tooltip">elo {{ elo }}</span>
        <button>invite to play</button>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import Player from '../models/Player'

@Component
export default class FriendsList extends Vue {
  @Prop() friends: Player[]
}
</script>

<style>
ul.friend-list {
  box-shadow: 0px 0px 4px black;
  text-align: left;
  border-radius: 5px;
  padding: 20px;
  padding-bottom: 15px;
  font-size: 20px;
  list-style-type: none;
}

.friend-list li {
  margin-bottom: 5px;
}

.friend-list-header {
  margin: auto;
  text-align: center;
  margin-bottom: 15px;
  font-size: 20px;
}

.friend {
  position: relative;
  display: inline-block;
  width: 100%;
}

.friend img {
  width: 20px;
  margin-right: 5px;
}

.friend button {
  line-height: 20px;
  float: right;
  cursor: pointer;
  font-family: 'Libre Baskerville', serif;
  font-size: 10px;
}

.friend-tooltip {
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
.friend:hover .friend-tooltip {
  visibility: visible;
}

.friend-tooltip::after {
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