import { User } from 'src/users/entities/user.entity';

export type TUser = Omit<User, 'password'>;
