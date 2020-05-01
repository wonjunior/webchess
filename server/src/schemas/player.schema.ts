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

export const PlayerEntity = mongoose.model("Player", PlayerSchema);