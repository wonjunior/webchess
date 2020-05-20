import Player from './Player'

export default interface Game {
  white: Player;
  black: Player;
  pgn: string;
}