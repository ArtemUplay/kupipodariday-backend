import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userByName = await this.usersService.findOne(
      'username',
      createUserDto.username,
    );

    const userByEmail = await this.usersService.findOne(
      'email',
      createUserDto.email,
    );

    if (userByName || userByEmail)
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );

    return this.usersService.create(createUserDto);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const existUser = await this.usersService.findOne('username', username);

    if (!existUser || !this.hashService.compare(password, existUser.password))
      return null;

    return existUser;
  }

  async login(user: User) {
    const { id, username, email } = user;
    return {
      id,
      username,
      email,
      access_token: this.jwtService.sign({
        id: user.id,
        username: user.username,
      }),
    };
  }
}
