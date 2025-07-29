import { User } from 'apps/user/src/domain/entity/user.entity';

declare module 'express' {
  interface Request {
    user: User;
  }
}
