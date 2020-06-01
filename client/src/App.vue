<template>
  <div id="app">
    <div class="header">
      <img src="@/assets/chess.png" alt="">
      <div class="header-text"> WebChess </div>
    </div>
    <div>
      <div class="menu-item"><router-link to="/">Home</router-link></div>
      <div class="menu-item" v-if="authenticated" v-on:click="logout"> Logout </div>
      <div class="menu-item" v-else v-on:click="$auth.loginRedirect()"> Login </div>
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

  // Variables `authenticated`, `ajax` and `socket` are props for all rendered router
  // views `authenticated`'s value is watched by thoses view components. Whenever it
  // changes it will indicate that the authentication was successful and that both
  // `socket` and `ajax` are available and ready to be used by the rendered component.
  public authenticated = false
  public ajax = null as null | Ajax
  public socket = null as null | WebChessSocket

  private created() {
    this.authenticate()
  }

  // The following function is called either when
  // (a) App is created (i.e. the SPA is loaded for the first time on the client) cf. #created() ;
  // (b) when the router changes the rendered page (i.e. <router-view /> component is changed).
  @Watch('$route')
  private async authenticate() {
    // If user is already authenticated, we want to absolutely
    // avoid overwriting `authenticated`, `socket` and `ajax`.
    if (this.authenticated) return null

    const authenticated = await this.$auth.isAuthenticated()

    // The user is not authenticated
    if (!authenticated) return null

    const token = await this.$auth.getAccessToken()

    // The access token is ready to be used. We can set both `authenticated`, `socket` and `ajax`.
    // It is paramount that `authenticated` gets set last because it signals that both `socket`
    // and `ajax` utilities are ready to be used by the rendered component.
    this.ajax = new Ajax(token)
    this.socket = new WebChessSocket(token)
    this.authenticated = authenticated
  }

  private async logout() {
    await this.$auth.logout();
    // this.$router.push({ name: 'home' })
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
  width: 60%;
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
  margin-bottom: 20px;
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
  font-size: 17px;
  line-height: 27px;
  background: #27242b;
  border-radius: 2px;
  box-shadow: none;
  cursor: pointer;
  display: inline-block;
  margin: 0 5px;
  height: 32px;
  padding: 4px 9px;
  color: white;
}
.menu-item:hover {
  box-shadow: 0 0 5px grey;
}
.menu-item a.router-link-active {
  color: grey;
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
