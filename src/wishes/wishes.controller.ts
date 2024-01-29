import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createWishDto: CreateWishDto,
    @Req() req,
  ): Promise<Wish> {
    return this.wishesService.create(createWishDto, req?.user);
  }

  @Get('last')
  async getLast(): Promise<Wish[]> {
    return this.wishesService.findByOrder({ createdAt: 'DESC' }, 40);
  }

  @Get('top')
  async getTop(): Promise<Wish[]> {
    return this.wishesService.findByOrder({ copied: 'DESC' }, 20);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ): Promise<Wish[]> {
    return this.wishesService.update(id, updateWishDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number, @Req() req): Promise<Wish> {
    return this.wishesService.delete(id, req.user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  async copy(@Param('id') id: number, @Req() req): Promise<Wish> {
    return this.wishesService.copy(id, req.user);
  }
}
