import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Province } from '../provinces/entities/province.entity';
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
    const { provinceId, ...rest } = createUserDto;
    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
      province: { provinceId },
    });
    const saved = await this.usersRepository.save(user);
    return this.findOne(saved.userId);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find({
      relations: { province: true },
    });
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(userId: string): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: { province: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.toSafeUser(user);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: { province: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const { provinceId, ...rest } = updateUserDto;
    Object.assign(user, rest);

    if (provinceId) {
      user.province = { provinceId } as Province;
    }

    const saved = await this.usersRepository.save(user);
    return this.findOne(saved.userId);
  }

  async remove(userId: string): Promise<null> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    await this.usersRepository.softRemove(user);
    return null;
  }

  async restore(userId: string): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.deletedAt) {
      throw new BadRequestException(`User with ID ${userId} is not deleted`);
    }

    await this.usersRepository.restore(userId);
    return this.findOne(userId);
  }
}
