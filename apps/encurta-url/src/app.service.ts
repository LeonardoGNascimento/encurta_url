import { Body, Injectable, Req } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { gerarStringAleatoria } from '../../../shared/core/generateCode';
import { Url } from './dominio/entity/url.entity';
import { CreateUrlDto } from './dominio/dto/createUrl.dto';

@Injectable()
export class AppService {
  constructor(@InjectRepository(Url) private urlRepository: Repository<Url>) {}

  getHello(usuarioId: any) {
    return this.urlRepository.find({
      where: {
        usuarioId,
      },
    });
  }

  async get(code: string) {
    const url = await this.urlRepository.findOneByOrFail({
      code,
    });

    return { url: url.url, statusCode: 301 };
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

    return code
  }
}
