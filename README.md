# WebChess

Online chess platform. Connect, play against other users, watch replays of your games as well as famous chess games, track progress on leaderboard. Webchess has been deployed on Heroku : [https://webchessmate.herokuapp.com](https://webchessmate.herokuapp.com)

![webchess dashboard](https://i.ibb.co/9cJk9hL/wchess-chat.png)
![webchess chessboard](https://i.ibb.co/GVQgYRz/wchess2.png)



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
- Chess REST API to track a game's progress and validate moves (https://github.com/anzemur/chess-api) [EDIT: replaced by Chess.js library]
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

# Installation instructions

Prerequisites: git, Node.JS and NPM installed

### 1. Clone the project
First, clone the project repository:
``` 
git clone https://github.com/WonJunior/webchess.git 
```
### 2. Create your Okta account
Since WebChess uses Okta for players authentication, you need to create a free account on Okta, create an application and get your **Client ID** and **Okta Domain** by following these instructions: https://developer.okta.com/docs/guides/sign-into-spa/vue/main/#create-an-okta-app-integration.

### 3. Create a MongoDB database
Webchess uses a MongoDB database so you need to either install MongoDB on your local machine and create a database, or use MongoDB Atlas for a cloud database (free). More informations availables here: https://docs.mongodb.com/manual/installation/. You will need to get the MongoDB connection string to your database.

### 4. Define environment variables
Then you need to define your environment configuration variables. To do so you may create .env files, one for the server : **./server/.env** and one for the client : **./client/.env**. 

Here is a template for the file **./server/.env**
```conf 
#The port used by the server
PORT=9002

#The connection string to your Mongo database
MONGO_CONNECTION_STRING=

#Your Okta Client ID
OKTA_CLIENT_ID=

#Your okta issuer, deduced from your Okta Domain
OKTA_ISSUER=https://YOUR_OKTA_DOMAIN_HERE/oauth2/default

OKTA_EXPECTED_AUDIENCE=api://default

#this api is not used anymore but this env variable may still be required
CHESS_API_ROOT=http://chess-api-chess.herokuapp.com/api/v1/chess/two/
```

Here is a template for the file **./client/.env**
```conf 
#The root url of the server
VUE_APP_BACKEND_ROOT=http://localhost:9002/

#Your Okta Client ID
VUE_APP_OKTA_CLIENT_ID=

#Your okta issuer, deduced from your Okta Domain
VUE_APP_OKTA_ISSUER=https://YOUR_OKTA_DOMAIN_HERE/oauth2/default
```

### 5. Start Webchess
Now you should be able to start the Webchess server and client (don't forget to install the dependancies).

Start server:
```Shell
cd server
npm install
npm run dev
```
Start client:
```Shell
cd client
npm install
npm run start
```
Here the client (which is a Vue.js Single Page Application) is served from a Vue.js debug server usually launched on port 8080. However, for deploying, you may want to use the Webchess server to serve the client application. In order to do that, first build the client with ``npm run build`` and then copy the **client/dist** folder in the **server/views** folder.


### 6. Create player's account
For now there is no way to register a new player on Webchess. So you need to add players's accounts manually. First add a new user on Okta : go to Okta dashboard > directory > people > add person. Then add a new document for the user on MongoDB, here is a template: 
```js
{
    //_id: should be created automatically by mongo
    name: "Name",
    email: "MyEmail@domain.com", // Should be the same email used in Okta !
    wins: 0,
    losses: 0,
    elo: 1500,
    previous_elo: [], //empty array
    current_game: {}, //empty object
    games: [],
    friends: []
}
```
