/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { HashService } from 'src/hash/hash.service';
import { TUser } from 'src/common/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findOne(key: string, param: any): Promise<User> {
    const user = await this.usersRepository.findOneBy({ [key]: param });

    return user;
  }

  async findUserByName(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const username = await this.findUserByName(createUserDto.username);
    const email = await this.findByEmail(createUserDto.email);
    if (username !== null) {
      throw new ForbiddenException(
        'Пользователь с таким именем уже существует',
      );
    }
    if (email) {
      throw new ForbiddenException(
        'Пользователь с таким e-mail уже существует',
      );
    }
    createUserDto.password = this.hashService.getHash(createUserDto?.password);
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<TUser> {
    const { id } = user;
    const { email, username } = updateUserDto;
    if (updateUserDto.password) {
      updateUserDto.password = this.hashService.getHash(updateUserDto.password);
    }
    const isExist = (await this.usersRepository.findOne({
      where: [{ email }, { username }],
    }))
      ? true
      : false;

    if (isExist) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
    try {
      await this.usersRepository.update(id, updateUserDto);
      const { password, ...updUser } = await this.usersRepository.findOneBy({
        id,
      });
      return updUser;
    } catch (_) {
      throw new BadRequestException(
        'Пользователь может редактировать только свой профиль',
      );
    }
  }

  async findWishes(id: number): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: { wishes: true },
      where: { id },
    });
    return users;
  }

  async findMany(query: string): Promise<User[]> {
    const searchResult = await this.usersRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
    return searchResult;
  }
}
