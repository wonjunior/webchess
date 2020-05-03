

import { PlayerEntity } from "../schemas/player.schema";
import { Types, MongooseDocument } from "mongoose";



export class PlayerModel {

  async getFriends(email: string) {
    try {
      const player = await PlayerEntity.findOne({email})
      if (player == null) return {error: true, friends: []}
      
      const friends = await PlayerEntity.find({
        '_id': { $in: player.friends}});

      return {error: false, friends}
    }
    catch(e) {
      return {error: true, friends: []}
    }  
  }

  async addFriend(email: string, idFriend: string) {
    try {
      const player = await PlayerEntity.findOne({email});
      if (player == null) {
        return {error: true}
      }
    //  const error = await PlayerEntity.exists({_id: idFriend})

      const friend = await PlayerEntity.findByIdAndUpdate(idFriend, {
        $addToSet: {friends: player.id}
      })
      if (friend == null) return {error: true}

      await PlayerEntity.findByIdAndUpdate(player.id, {
        $addToSet: {friends: idFriend}
      })  
      return {error: false}
    }
    catch(e) {
      return {error: true}
    }

  }

  async deleteFriend(email: string, idFriend: string) {
    try {
      const player = await PlayerEntity.findOne({email});
      if (player == null) {
        return {error: true}
      }
      await PlayerEntity.findByIdAndUpdate(idFriend, {
        $pull: {friends: player.id}
      })
      await PlayerEntity.findByIdAndUpdate(player.id, {
        $pull: {friends: idFriend}
      })  
      return {error: false}
    }
    catch(e) {
      return {error: true}
    }
  }

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