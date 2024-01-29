import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req,
  ): Promise<Offer> {
    return this.offersService.create(createOfferDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<Offer[]> {
    return this.offersService.findMany();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOne(id);
  }
}
