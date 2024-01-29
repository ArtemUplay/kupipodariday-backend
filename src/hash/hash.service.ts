import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

@Injectable()
export class HashService {
  getHash(password: string): string {
    return hashSync(password, genSaltSync(10));
  }

  compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
