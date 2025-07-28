import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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

  gerarStringAleatoria(length: number = 6): string {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < length; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres[indice];
    }
    return resultado;
  }

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
    let code = this.gerarStringAleatoria();

    const codeFind = await this.urlRepository.findOne({
      where: {
        code,
      },
    });

    while (code === codeFind?.code) {
      code = this.gerarStringAleatoria();
    }

    await this.urlRepository.save({
      code,
      url: body.url,
      usuarioId: body.usuarioId,
    });

    return `${this.configService.get('URL')}/${code}`;
  }
}
