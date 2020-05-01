

import { PlayerEntity } from "../schemas/player.schema";
import { Types, MongooseDocument } from "mongoose";


export class PlayerModel {

  async get(playerEmail: string) {
    try{
      const player = await PlayerEntity.find({email: playerEmail});
      return player
    }
    catch(error) {
      return null
    }

  }
  
  async delete(playerEmail: string)
  {
    try {
      const deleted = await PlayerEntity.findOneAndDelete({email: playerEmail})
      return true
    }
    catch(e) {
      return false 
    }
  }

  async addNew(reqBody: any) {

    if(!reqBody.name)
      return false;

    if(reqBody.name == "")
      return false;

    const player = new PlayerEntity({
      name: reqBody.name,
      email: "",
      wins: 0,
      losses: 0,
      elo: 1500,
      previous_elo: [1500],
      current_game: {},
      friends: [],
    }) 

    try {
      await player.save()
      return true
    }
    catch(error) {
      console.log(error)
      return false
    }
  }
}