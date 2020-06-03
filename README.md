## Screencast:

- Mid term screencast: https://drive.google.com/open?id=1mwGlG66e5qJCH__R6gG6FPdLgwPVPN0Y

* Final screencasts
  * Project demo: https://drive.google.com/file/d/1FnMAGrm3o_Xtqj8x0W0cI5onPKYBSIiU/view?usp=sharing
  * Ivan's screencast: https://drive.google.com/file/d/1bCSc1NMaQn6Cn0t02urReVisg5thDQAi/view?usp=sharing
  * Hugo's screencast: https://drive.google.com/file/d/15iyDDAb2hiCHs1x2w8nPHWwiR71Hlc-m/view?usp=sharing

<p>&nbsp;</p>

## Project idea:

Online chess platform. Connect, play against other users, watch replays of your games as well as famous chess games, track progress on leaderboard.


## Features:

- create account / connect to platform
- invite another player for a game from the player list
- game interface: play a game of chess
- list of previous games (wins & losses) and stats
- view leaderboard with best players on top
- replay a game from the list of already played games


## Server side: Node.js with following frameworks/services:

- Express.js
- Okta authentification (https://developer.okta.com/quickstart/#/vue/nodejs/express)
- Socket.io (https://socket.io/docs/server-api/)
- Chess REST API to track a game's progress and validate moves (https://github.com/anzemur/chess-api)
- Mongo DB (http://mongodb.github.io/node-mongodb-native/3.4/quick-start/quick-start/)

## Client side:

- Vue.js with Typescript
- Socket.io integration for Vue.js (https://www.npmjs.com/package/vue-socket.io)
- Chess API to view chess board and play moves (https://nimzozo.github.io/Ab-Chess/)

## Other :

- Testing will be done using Jest
- To replay famous games we can scrape data from a online dataset: https://www.chessgames.com


## General Architecture :

![architecture diagram](https://i.ibb.co/SsnW5hP/Webchess-architecture.png)