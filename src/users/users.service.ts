import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(userid: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { userid } });
    if (!user) {
      throw new Error(`User with ID ${userid} not found`);
    }
    return user;
  }

  async update(userid: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userid);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(userid: number): Promise<User> {
    const user = await this.findOne(userid);
    return this.usersRepository.remove(user);
  }
}
