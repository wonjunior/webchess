import mongoose from 'mongoose'

// Typescript type declaration for Player
export interface Player extends mongoose.Document {
  name: string;
  email: String;
  wins: number;
  losses: number;
  elo: number;
  previous_elo: number[];
  current_game: {
    white: string;
    black: string;
    moves: string;
  };
  games: {
    white: { name: string, id: string };
    black: { name: string, id: string };
    pgn: string;
    date: Date;
    result: string;
  }[];
  friends: string[];
}

// MongoDB declaration for a Player document
const PlayerSchema = new mongoose.Schema({
  name: { type: String, text: true },   // allows indexing
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
  games: [{
    white: { name: String, id: String },
    black: { name: String, id: String },
    pgn: String,
    date: Date,
    result: String,
  }],
  friends: [String],
})

PlayerSchema.index({ name: 'text' })


export const PlayerEntity = mongoose.model<Player>("Player", PlayerSchema)