import { Server, Socket } from "socket.io";
import uuid from "uuid/v4";
import OktaJwtVerifier from "@okta/jwt-verifier";
import okta from "@okta/okta-sdk-nodejs";
import { Game } from './services/game'
import { WebChessSocket } from './middleware/Helpers'

const messageExpirationTimeMS = 10 * 1000;

export interface IUser {
  id: string;
  name: string;
}

// const defaultUser: IUser = {
//   id: "anon",
//   name: "Anonymous",
// };

// export interface IMessage {
//   user: IUser;
//   id: string;
//   time: Date;
//   value: string;
// }


// const sendMessage = (socket: Socket | Server) =>
  // (message: IMessage) => socket.emit("message", message);

export default (io: Server) => {
  // const messages: Set<IMessage> = new Set();
  const games: Map<string, Game> = new Map();
  const users: Map<Socket, IUser> = new Map();

  //io.use(async (socket, next) => {}

  io.on("connection", async (socket: WebChessSocket) => {

    // create new game
    if (!socket.handshake.query.gameId){
      let game = new Game()
      await game.create(socket)
      games.set(game.id, game)
      socket.game = game.id
      console.log('\nA new game has been created with id: ', game.id)
    }
    //join existing game
    else {
      console.log("A player has joined game: " + socket.handshake.query.gameId)
      let game = games.get(socket.handshake.query.gameId)
      if (!game) return

      socket.game = socket.handshake.query.gameId
      game.join(socket)
    }


    /*socket.on("getMessages", () => {
      messages.forEach(sendMessage(socket));
    });

    socket.on("message", (value: string) => {
      //users.get(socket.users)
      const message: IMessage = {
        id: uuid(),
        time: new Date(),
        user: defaultUser,
        value,
      };

      messages.add(message);

      sendMessage(io)(message);

      setTimeout(
        () => {
          messages.delete(message);
          io.emit("deleteMessage", message.id);
        },
        messageExpirationTimeMS,
      );
    });*/
  });
};