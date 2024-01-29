import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Название подарка должно быть не менее 1 символа',
  })
  @MaxLength(250, {
    message: 'Название подарка должно быть не более 250 символов',
  })
  name: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Column({
    default: 0,
    type: 'decimal',
    scale: 2,
  })
  @IsNumber()
  price: number;

  @Column({
    default: 0,
    type: 'decimal',
    scale: 2,
  })
  @IsNumber()
  raised: number;

  @Column()
  @IsString()
  @MinLength(1, {
    message: 'Описание подарка должно быть не менее 1 символа',
  })
  @MaxLength(1024, {
    message: 'Описание подарка должно быть не более 1024 символов',
  })
  @IsNotEmpty()
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsNumber()
  copied: number;
}
