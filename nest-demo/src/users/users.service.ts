import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  find(userId: User['id']) {
    return this.usersRepository.findOne(userId);
  }

  create(user: User) {
    return this.usersRepository.insert(user);
  }

  remove(userId: User['id']) {
    return this.usersRepository.delete(userId);
  }
}
