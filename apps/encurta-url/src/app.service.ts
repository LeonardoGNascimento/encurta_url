import { Injectable, NotFoundException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { gerarStringAleatoria } from '../../../shared/core/generateCode';
import { CreateUrlDto } from './dominio/dto/createUrl.dto';
import { UpdateUrlDto } from './dominio/dto/updateUrl.dto';
import { Click } from './dominio/entity/clicks.entity';
import { Url } from './dominio/entity/url.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Url) private urlRepository: Repository<Url>,
    @InjectRepository(Click) private clickRepository: Repository<Click>,
    private configService: ConfigService,
  ) {}

  list(usuarioId: any) {
    return this.urlRepository.find({
      relations: {
        clicks: true,
      },
      where: {
        deleted: IsNull(),
        usuarioId,
      },
    });
  }

  async findByIdAndUser({ usuarioId, id }: any) {
    const url = await this.urlRepository.findOne({
      where: {
        id,
        usuarioId,
        deleted: IsNull(),
      },
    });

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    return url;
  }

  async delete(data: any) {
    await this.findByIdAndUser(data);

    return await this.urlRepository
      .update(
        {
          id: data.id,
        },
        {
          deleted: new Date(),
        },
      )
      .then((item) => (item.affected ? item.affected > 0 : false));
  }

  async update(data: UpdateUrlDto) {
    await this.findByIdAndUser(data);

    return await this.urlRepository.update(
      { id: data.id },
      {
        url: data.url,
      },
    );
  }

  async get(code: string) {
    const url = await this.urlRepository.findOneByOrFail({
      code,
    });

    this.clickRepository.save({
      url: {
        id: url.id,
      },
    });

    return { url: url.url, statusCode: 302 };
  }

  async create(body: CreateUrlDto) {
    let code = gerarStringAleatoria();

    const codeFind = await this.urlRepository.findOne({
      where: {
        code,
      },
    });

    while (code === codeFind?.code) {
      code = gerarStringAleatoria();
    }

    await this.urlRepository.save({
      code,
      url: body.url,
      usuarioId: body.usuarioId,
    });

    return `${this.configService.get('URL')}/${code}`;
  }
}
