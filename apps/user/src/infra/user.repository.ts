import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/entity/user.entity';
import { CreateUserDto } from '../domain/dto/createUser.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUsuarioDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createUsuarioDto);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
