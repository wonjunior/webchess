import { Server, Socket } from "socket.io";
import uuid from "uuid/v4";
import OktaJwtVerifier from "@okta/jwt-verifier";
import okta from "@okta/okta-sdk-nodejs";
import Ajax from "./utils/Ajax";

/*
const jwtVerifier = new OktaJwtVerifier({
  clientId: process.env.OKTA_CLIENT_ID,
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
});

const oktaClient = new okta.Client({
  orgUrl: process.env.OKTA_ORG_URL,
  token: process.env.OKTA_TOKEN,
});
*/

const ajax = new Ajax();

const messageExpirationTimeMS = 10 * 1000;

export interface IUser {
  id: string;
  name: string;
}

const defaultUser: IUser = {
  id: "anon",
  name: "Anonymous",
};

export interface IMessage {
  user: IUser;
  id: string;
  time: Date;
  value: string;
}

interface WebChessSocket extends Socket {
  game: string;
}

interface Move {
  from: string;
  to: string;
}

class Game {
  
  id = ""
  socketWhite: any // Socket | null = null
  socketBlack: any
  turn = 'w'
  state = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

  async create(socket: WebChessSocket) {
    this.socketWhite = socket
    const { game_id } = await ajax.get('')
    this.id = game_id
  }

  join(socket: WebChessSocket): boolean {
    this.socketBlack = socket
    if (this.socketWhite == null) return false

    this.socketBlack.on('move', async (move: Move) => {
      await this.onMoveReceived(move, 'b')
    })

    this.socketWhite.on('move', async (move: Move) => {
      await this.onMoveReceived(move, 'w')
    })

    this.socketWhite.emit('yourTurn', this.state)
    return true
  }

  async onMoveReceived(move: Move, color: string) {

    if(!(await this.playMove(move, color))) return

    if (this.turn == 'b') 
      this.socketBlack.emit('yourTurn', this.state)
    else
      this.socketWhite.emit('yourTurn', this.state)
  
  }

  //here we trust API
  async playMove(move: Move, color: string): Promise<boolean> {
    const { status } = await ajax.post('move', {
      from: move.from,
      to: move.to,
      game_id: this.id
    })
    if(status == 'figure moved') {
      const res = await ajax.post('fen', { game_id: this.id })
      if (!res.fen_string) return false
    
      if (this.turn == 'w') 
        this.turn = 'b'
      else 
        this.turn = 'w'

      this.state = res.fen_string
      return true
    }
    else
      return false
  }
}

const sendMessage = (socket: Socket | Server) =>
  (message: IMessage) => socket.emit("message", message);



export default (io: Server) => {
  const messages: Set<IMessage> = new Set();
  const games: Map<string, Game> = new Map();
  const users: Map<Socket, IUser> = new Map();
  //io.use(async (socket, next) => {}

  //serveur de messagerie
  io.on("connection", async (socket: WebChessSocket) => {

    //create new game
    if(!socket.handshake.query.gameId){
      let game = new Game()
      await game.create(socket)
      games.set(game.id, game)
      socket.game = game.id
      console.log('\nA new game has been created with id:')
      console.log(game.id)
    }
    //join existing game
    else{
      console.log("A player has joined game" + socket.handshake.query.gameId)
      let game = games.get(socket.handshake.query.gameId)
      if (!game) return
  
      socket.game = socket.handshake.query.gameId
      game.join(socket)
    }


    socket.on("getMessages", () => {
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
    });
  });
};