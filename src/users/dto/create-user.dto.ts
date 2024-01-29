import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'Имя пользователя должно быть не менее 2 символов',
  })
  @MaxLength(30, {
    message: 'Имя пользователя должно быть не более 30 символов',
  })
  username: string;

  @IsString()
  @IsOptional()
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Пароль должен быть не менее 6 символов',
  })
  password: string;
}
