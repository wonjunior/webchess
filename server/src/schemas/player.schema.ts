import mongoose from 'mongoose';


const PlayerSchema = new mongoose.Schema({
  name: String,
  email: String,
  wins: Number,
  losses: Number,
  elo: Number,
  previous_elo: [Number],
  current_game: {
    white: String,
    black: String,
    moves: String,
  },
  friends: [String],
});

export interface Player extends mongoose.Document {
  name: string;
  email: String;
  wins: number;
  losses: number;
  elo: number;
  previous_elo: number [];
  current_game: {
    white: string;
    black: string;
    moves: string;
  };
  friends: string[];
}

export const PlayerEntity = mongoose.model<Player>("Player", PlayerSchema);