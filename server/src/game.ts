
import { Socket } from "socket.io";
import Ajax from "./utils/Ajax";


export interface WebChessSocket extends Socket {
    game: string;
  }
  
interface Move {
    from: string;
    to: string;
  }

const ajax = new Ajax();

export class Game {
  
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

      if (this.turn != color) return
  
      if(!(await this.playMove(move, color))) return

      this.checkGameOver()
  
      if (this.turn == 'b') 
        this.socketBlack.emit('yourTurn', this.state)
      else
        this.socketWhite.emit('yourTurn', this.state)
    
    }

    async checkGameOver() {
      const res = await ajax.post('check', { game_id: this.id })
      if (res.game_over_status) {
        this.socketBlack.emit('gameover', {})
        this.socketWhite.emit('gameover', {})
      }

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