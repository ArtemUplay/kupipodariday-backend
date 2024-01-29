/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Req,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { TUser } from 'src/common/types';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req): Promise<TUser> {
    const { password, ...rest } = await this.usersService.findOne(
      'id',
      req.user.id,
    );
    return rest;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Body() body): Promise<TUser> {
    return this.usersService.update(req.user, body);
  }

  @Get('me/wishes')
  @UseGuards(JwtAuthGuard)
  async getMeWishes(@Req() req): Promise<Wish[]> {
    const users = await this.usersService.findWishes(req.user.id);
    const wishes = users.map((user) => user.wishes);
    return wishes[0];
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('username') username): Promise<TUser> {
    return this.usersService.findOne('username', username);
  }

  @Get(':username/wishes')
  @UseGuards(JwtAuthGuard)
  async getUsersWishes(@Param('username') username): Promise<Wish[]> {
    return this.wishesService.findMany('owner', { username });
  }

  @Post('find')
  @UseGuards(JwtAuthGuard)
  async findUsers(@Body('query') query: string): Promise<TUser[]> {
    return this.usersService.findMany(query);
  }
}
