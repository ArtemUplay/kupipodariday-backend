import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { FindOptionsOrder, In, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    return await this.wishesRepository.save({ ...createWishDto, owner });
  }

  async findByOrder(
    order: FindOptionsOrder<Wish>,
    limit: number,
  ): Promise<Wish[]> {
    return await this.wishesRepository.find({
      relations: { owner: true },
      order: order,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      relations: { owner: true, offers: { user: true } },
      where: { id },
    });
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish[]> {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять описание своих подарков и стоимость, если кто то уже решил скинуться',
      );
    }
    if (wish?.owner?.id !== userId || wish.offers.length) {
      throw new BadRequestException('Невозможно для чужих подарков');
    }
    try {
      await this.wishesRepository.update(id, updateWishDto);
      return await this.wishesRepository.findBy({ id });
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number, userId: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (wish?.owner?.id !== userId || wish.offers.length) {
      throw new BadRequestException('Невозможно для чужих подарков');
    }
    return await this.wishesRepository.remove(wish);
  }

  async copy(id: number, user: User): Promise<Wish> {
    const wish = await this.wishesRepository.findOneBy({ id });
    const isAdded = (await this.wishesRepository.findOne({
      where: { owner: { id: user.id }, name: wish.name },
    }))
      ? true
      : false;
    if (isAdded) throw new ConflictException('Подарок уже скопирован');
    wish.owner = user;
    delete wish.id;
    return await this.wishesRepository.save(wish);
  }

  async findMany(key: string, param: any): Promise<Wish[]> {
    return await this.wishesRepository.findBy({
      [key]: param,
    });
  }

  async findManyById(ids: number[]): Promise<Wish[]> {
    return await this.wishesRepository.findBy({
      id: In(ids),
    });
  }

  async updateByRise(id: number, newRise: number) {
    return await this.wishesRepository.update({ id: id }, { raised: newRise });
  }
}
