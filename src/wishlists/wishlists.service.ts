import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });

    if (!wishlists) {
      throw new BadRequestException('Список подарков не найден');
    }

    return wishlists;
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const items = [];
    const { image, name } = createWishlistDto;
    for (const itemId of createWishlistDto.itemsId) {
      items.push(await this.wishesService.findOne(itemId));
    }
    return await this.wishlistsRepository.save({
      image,
      name,
      owner,
      items,
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new BadRequestException('Список подарков не найден');
    }

    return wishlist;
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    let items;
    if (updateWishlistDto.itemsId) {
      items = await this.wishesService.findManyById(
        updateWishlistDto.itemsId as number[],
      );
    }
    if (user.id !== wishlist?.owner?.id) {
      throw new BadRequestException('Что то не так');
    }
    await this.wishlistsRepository.save({
      id: wishlist.id,
      items: items ? items : wishlist.items,
      name: updateWishlistDto.name ? updateWishlistDto.name : wishlist?.name,
      image: updateWishlistDto.image
        ? updateWishlistDto.image
        : wishlist?.image,
      owner: wishlist.owner,
    });
    return await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
  }

  async remove(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (user.id !== wishlist.owner.id) {
      throw new BadRequestException('Что то не так');
    }
    return await this.wishlistsRepository.remove(wishlist);
  }
}
