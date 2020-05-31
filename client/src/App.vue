<template>
  <div id="app">
    <div class="header">
      <img src="@/assets/chess.png" alt="">
      <div class="header-text"> WebChess </div>
    </div>
    <div>
      <button class="menu-item"><router-link to="/">Home</router-link></button>
      <button class="menu-item" v-if="authenticated" v-on:click="logout" id="logout-button"> Logout </button>
      <button class="menu-item" v-else v-on:click="$auth.loginRedirect()" id="login-button"> Login </button>
    </div>
    <div class="home">
      <router-view :socket="socket" :ajax="ajax" :authenticated="authenticated" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'

import Ajax from './utils/Ajax'
import { WebChessSocket } from './services/WebChessSocket'

@Component
export default class App extends Vue {
  public authenticated = false
  public ajax = null as null | Ajax
  public socket = null as null | WebChessSocket

  private async created() {
    const authenticated = await this.$auth.isAuthenticated()

    if (!authenticated) return null;

    const token = await this.$auth.getAccessToken()

    this.ajax = new Ajax(token)
    this.socket = new WebChessSocket(token)
    this.authenticated = authenticated
  }

  // @Watch('$route')
  // private async isAuthenticated() {}

  private async logout() {
    await this.$auth.logout();

    // Navigate back to home
    // this.$router.push({path: '/'});
  }
}
</script>

<style lang="less">
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
  color: black;
}
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
.header {
  width: 330px;
  margin: auto;
  color: #27242b;
  border-bottom: 2px solid #27242b;
  margin-bottom: 10px;
  user-select: none;
  cursor: pointer;
}
.header-text {
  margin: 0;
  font-size: 40px;
  font-family: Cambria;
}
.header > img {
  width: 330px;
}

.menu-item {
  font-family: 'Libre Baskerville', serif;
  padding: 4px 8px;
  font-size: 16px;
  cursor: pointer;
}

#app {
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
