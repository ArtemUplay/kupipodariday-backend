import { IsString, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUrl()
  image: string;

  itemsId: number[];
}
