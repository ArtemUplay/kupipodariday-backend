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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Wishlist } from './entities/wishlist.entity';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: number,
    @Req() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.updateOne(id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number, @Req() req): Promise<Wishlist> {
    return this.wishlistsService.remove(id, req.user);
  }
}
