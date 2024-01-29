import { IsString, MaxLength, MinLength } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @MinLength(2, {
    message: 'Информация о себе должна быть не менее 2 символов',
  })
  @MaxLength(200, {
    message: 'Информация о себе должна быть не более 200 символов',
  })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @IsString()
  @MinLength(6, {
    message: 'Пароль должен быть не менее 6 символов',
  })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner, { onDelete: 'CASCADE' })
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user, { onDelete: 'CASCADE' })
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner, {
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];
}
