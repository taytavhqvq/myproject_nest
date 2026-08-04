import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const saved = await this.usersRepository.save(user);
    return this.toSafeUser(saved);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(userid: string): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { userid } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userid} not found`);
    }
    return this.toSafeUser(user);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(
    userid: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { userid } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userid} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const saved = await this.usersRepository.save(user);
    return this.toSafeUser(saved);
  }

  async remove(userid: string): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { userid } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userid} not found`);
    }
    await this.usersRepository.softRemove(user);
    return this.toSafeUser(user);
  }
}
