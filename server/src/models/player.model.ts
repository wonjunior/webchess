// import { Types, MongooseDocument } from 'mongoose'

import { PlayerEntity, Player } from '../schemas/player.schema'
import { databaseErrorHandling } from '../middleware/Helpers'

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
      name,
      email,
      wins: 0,
      losses: 0,
      elo: 1500,
      previous_elo: [1500],
      current_game: {},
      games: [],
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

  /**
   * Returns all players which validate both points:
   * (a) are not friends with `this.player`
   * (b) match the input string
   * @param input the search input
   */
  async search(input: string) {
    if (!input) return { error: 'The input is empty' }

    return await PlayerEntity
      .find({ $text: { $search: input } })
      .then((players: Player[]) => {
        return players
          .filter(({ _id }) => !this.player.friends.includes(_id))
          .map(({ _id, name, elo }) => ({ id: _id, name, elo }))
      })
      .catch(databaseErrorHandling)
  }

  async delete(email: string) {
    return await PlayerEntity
      .findOneAndDelete({ email }) // KEK
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

  async archiveGame(white: {name: string, id: string}, black: {name: string, id: string}, pgn: string, result: string) {
    return await PlayerEntity
      .findByIdAndUpdate(this.player.id, {
        $addToSet: { games: { white, black, pgn, date: new Date(), result } }
      })
      .catch(databaseErrorHandling)
  }
}