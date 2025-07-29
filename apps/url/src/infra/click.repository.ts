import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Click } from '../domain/entity/clicks.entity';

@Injectable()
export class ClickRepository {
  constructor(
    @InjectRepository(Click) private clickRepository: Repository<Click>,
  ) {}

  async create(urlId: number) {
    return await this.clickRepository.save({
      url: {
        id: urlId,
      },
    });
  }
}
