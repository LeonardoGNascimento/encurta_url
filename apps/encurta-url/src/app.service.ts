import { Body, Injectable, NotFoundException, Req } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { gerarStringAleatoria } from '../../../shared/core/generateCode';
import { Url } from './dominio/entity/url.entity';
import { CreateUrlDto } from './dominio/dto/createUrl.dto';
import { UpdateUrlDto } from './dominio/dto/updateUrl.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Url) private urlRepository: Repository<Url>,
    private configService: ConfigService,
  ) {}

  getHello(usuarioId: any) {
    return this.urlRepository.find({
      where: {
        usuarioId,
      },
    });
  }

  async findByIdAndUser({ usuarioId, id }: any) {
    const url = await this.urlRepository.findOne({
      where: {
        id,
        usuarioId,
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
      .delete({
        id: data.id,
      })
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
