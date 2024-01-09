import {getRepository, Repository} from 'typeorm';

import {User} from '../../../users/entities/User';
import {Game} from '../../entities/Game';

import {IGamesRepository} from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where(
        `LOWER(games.title) like :param`, 
        {param: `%${param.toLowerCase()}%`}
      )
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT COUNT(*) FROM games'); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // Complete usando query builder
    const game = await this.repository
      .createQueryBuilder('games')
      .where('games.id = :id', {id})
      .leftJoinAndSelect('games.users', 'users')
      .getOneOrFail()
    return game.users
  }
}
