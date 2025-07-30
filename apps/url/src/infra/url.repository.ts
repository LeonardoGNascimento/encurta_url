import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { FindByIdAndUserDto } from '../domain/dto/findByIdAndUser.dto';
import { ListUrlsReturnDto } from '../domain/dto/listUrls.return.dto';
import { Url } from '../domain/entity/url.entity';

@Injectable()
export class UrlRepository {
  constructor(@InjectRepository(Url) private urlRepository: Repository<Url>) {}

  async list(userId: number): Promise<ListUrlsReturnDto[]> {
    return this.urlRepository
      .find({
        relations: {
          clicks: true,
        },
        where: {
          deleted: IsNull(),
          userId,
        },
      })
      .then((item) => {
        return item.map(
          ({ clicks, ...item2 }): ListUrlsReturnDto => ({
            ...item2,
            totalClicks: clicks.length,
          }),
        );
      });
  }

  async findByIdAndUser({ userId, id }: FindByIdAndUserDto) {
    return await this.urlRepository.findOne({
      where: {
        id,
        userId,
        deleted: IsNull(),
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    return await this.urlRepository
      .update(
        {
          id,
        },
        {
          deleted: new Date(),
        },
      )
      .then((item) => (item.affected ? item.affected > 0 : false));
  }

  async update(data: Partial<Url>): Promise<boolean> {
    return await this.urlRepository
      .update(
        { id: data.id },
        {
          url: data.url,
        },
      )
      .then((item) => (item.affected ? item.affected > 0 : false));
  }

  async get(code: string): Promise<Url | null> {
    return await this.urlRepository.findOneBy({
      code,
      deleted: IsNull(),
    });
  }

  async create(body: Partial<Url>): Promise<Url> {
    return await this.urlRepository.save({
      code: body.code,
      url: body.url,
      userId: body.userId,
    });
  }
}
