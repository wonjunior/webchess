import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  name: String,
  wins: Number
});

export const Player = mongoose.model("Player", PlayerSchema);