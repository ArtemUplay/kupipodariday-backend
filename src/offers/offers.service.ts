import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const wishes = await this.wishesService.findOne(createOfferDto.itemId);
    const wish = await this.wishesService.findOne(wishes.id);
    const sum = wish.price - wish.raised;
    const newRise = Number(wish.raised) + Number(createOfferDto.amount);

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Вы не можете поддерживать свои подарки');
    }
    if (createOfferDto.amount > wish.price) {
      throw new ForbiddenException('Сумма поддержки больше стоимости подарка');
    }

    if (createOfferDto.amount > sum) {
      throw new ForbiddenException(
        'Сумма поддержки больше оставшейся для сбора суммы на подарок',
      );
    }

    if (wish.raised === wish.price) {
      throw new ForbiddenException('Нужная сумма уже собрана');
    }

    await this.wishesService.updateByRise(createOfferDto.itemId, newRise);
    const offerDto = { ...createOfferDto, user: user, item: wish };
    return await this.offerRepository.save(offerDto);
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOneBy({ id });
    if (!offer) {
      throw new NotFoundException(`Не удалось найти заявку с id: ${id}`);
    }
    return offer;
  }

  async findMany(): Promise<Offer[]> {
    return await this.offerRepository.find();
  }
}
