<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div>
      <button v-if="authenticated" v-on:click="logout" id="logout-button"> Logout </button>
      <button v-if="authenticated" v-on:click="getInfo"> Get User Info </button>
      <button v-if="authenticated" v-on:click="getToken"> Get Token </button>
      <button v-else v-on:click="$auth.loginRedirect()" id="login-button"> Login </button>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  public authenticated = false;

  private created() {
    this.isAuthenticated();
  }

  @Watch('$route')
  private async isAuthenticated() {
    this.authenticated = await this.$auth.isAuthenticated()
  }

  private async logout() {
    await this.$auth.logout();

    // Navigate back to home
    // this.$router.push({path: '/'});
  }

  private async getInfo() {
    const user = await this.$auth.getUser()
    console.log(user)
  }

  private async getToken() {
    const token = await this.$auth.getAccessToken()
    console.log(token)
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
