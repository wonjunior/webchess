import { Types, MongooseDocument } from 'mongoose'

import { PlayerEntity, Player } from '../schemas/player.schema'
import { databaseErrorHandling } from '../middleware/Helpers'
import { response } from 'express'

export class PlayerModel {
  player: Player

  static async all() {
    return await PlayerEntity
      .find({})
      .catch(databaseErrorHandling)
  }

  constructor(player: Player) {
    this.player = player
  }

  async create(email: string, name: string) {
    if (!name) return { error: 'Provided name is not valid' }

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

    return await player.save().catch(databaseErrorHandling)
  }

  async update(email: string, name: string) {
    if (!name) return { error: 'Provided name is not valid' }

    PlayerEntity
      .findOneAndUpdate({ email }, { name })
      .then(() => ({ message: 'Player updated successfully' }))
      .catch(databaseErrorHandling)
  }

  async delete(email: string) {
    return await PlayerEntity
      .findOneAndDelete({ email })
      .catch(databaseErrorHandling)
  }

  async getFriends() {
    return await PlayerEntity
      .find({ '_id': { $in: this.player.friends }})
      .catch(databaseErrorHandling)
  }

  async addFriend(friendId: string) {
    const response = await PlayerEntity
      .findByIdAndUpdate(friendId, { $addToSet: { friends: this.player.id } })
      .catch(databaseErrorHandling)

    if (response.error) return response

    return await PlayerEntity
      .findByIdAndUpdate(this.player.id, { $addToSet: { friends: friendId } })
      .then(() => ({ message: 'Player has been added to your friends list' }))
      .catch(databaseErrorHandling)
  }

  async deleteFriend(friendId: string) {
    return await Promise.all([
      PlayerEntity.findByIdAndUpdate(friendId, { $pull: { friends: this.player.id } }),
      PlayerEntity.findByIdAndUpdate(this.player.id, { $pull: { friends: friendId } })
    ])
      .then(() => ({ message: 'Player has beed removed from your friends list' }))
      .catch(databaseErrorHandling)
  }
}