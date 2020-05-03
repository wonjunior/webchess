

import { PlayerEntity, Player } from "../schemas/player.schema";
import { Types, MongooseDocument } from "mongoose";


const defaultErrorMsg = "An error occured with the database of the server"

export class PlayerModel {

  getFriends(player: Player) {
    return PlayerEntity
      .find({'_id': { $in: player.friends}})
      .catch(() => ({error: defaultErrorMsg}))
  }

  async addFriend(player: Player, idFriend: string) {
    const response = await PlayerEntity
      .findByIdAndUpdate(idFriend, {$addToSet: { friends: player.id } })
      .catch(() => ({error: "The player you tried to add as friend does not exist" }))
  
    if (response.error) return response

    return await PlayerEntity
      .findByIdAndUpdate(player.id, { $addToSet: { friends: idFriend } })
      .then(() => ({}))
      .catch(() => ({ error: defaultErrorMsg }))
  }

  async deleteFriend(player: Player, idFriend: string) {
    return await Promise.all([
      PlayerEntity.findByIdAndUpdate(idFriend, {$pull: { friends: player.id } }),
      PlayerEntity.findByIdAndUpdate(player.id, { $pull: { friends: idFriend } })
    ])
      .catch(() => ({ error: defaultErrorMsg }))
      .then(() => ({}))
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

    if(!reqBody.name || !reqBody.email){
      return false
    }

    const name = reqBody.name;
    const email = reqBody.email;

    if(name == "" || email == "") {
      return false
    }
  
    const player = new PlayerEntity({
      name: name,
      email: email,
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