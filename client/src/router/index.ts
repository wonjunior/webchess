import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@okta/okta-vue'

import Home from '../views/Home.vue'
import Replay from '../views/Replay.vue'
import Chessboard from '../views/Chessboard.vue'

Vue.use(Auth, {
  issuer: process.env.VUE_APP_OKTA_ISSUER,
  clientId: process.env.VUE_APP_OKTA_CLIENT_ID,
  redirectUri: window.location.origin + '/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
})

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/play',
      name: 'play',
      component: Chessboard
    },
    {
      path: '/replay',
      name: 'replay',
      component: Replay
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router