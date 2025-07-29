import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Url } from '../domain/entity/url.entity';
import { UpdateUrlDto } from '../domain/dto/updateUrl.dto';
import { CreateUrlDto } from '../domain/dto/createUrl.dto';

@Injectable()
export class UrlRepository {
  constructor(@InjectRepository(Url) private urlRepository: Repository<Url>) {}

  async list(usuarioId: any) {
    return this.urlRepository
      .find({
        relations: {
          clicks: true,
        },
        where: {
          deleted: IsNull(),
          usuarioId,
        },
      })
      .then((item) => {
        return item.map(({ clicks, ...item2 }) => ({
          ...item2,
          clicks: clicks.length,
        }));
      });
  }

  async findByIdAndUser({ usuarioId, id }: any) {
    return await this.urlRepository.findOne({
      where: {
        id,
        usuarioId,
        deleted: IsNull(),
      },
    });
  }

  async delete(id: number) {
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

  async update(data: UpdateUrlDto) {
    return await this.urlRepository.update(
      { id: data.id },
      {
        url: data.url,
      },
    );
  }

  async get(code: string) {
    return await this.urlRepository.findOneBy({
      code,
    });
  }

  async create(body: CreateUrlDto) {
    return await this.urlRepository.save({
      code: body.code,
      url: body.url,
      usuarioId: body.usuarioId,
    });
  }
}
