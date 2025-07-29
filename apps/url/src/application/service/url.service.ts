import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUrlDto } from '../../domain/dto/createUrl.dto';
import { UpdateUrlDto } from '../../domain/dto/updateUrl.dto';
import { ClickRepository } from '../../infra/click.repository';
import { UrlRepository } from '../../infra/url.repository';

@Injectable()
export class UrlService {
  constructor(
    private urlRepository: UrlRepository,
    private clickRepository: ClickRepository,
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
    return this.urlRepository.list(usuarioId);
  }

  async findByIdAndUser({ usuarioId, id }: any) {
    const url = await this.urlRepository.findByIdAndUser({
      usuarioId,
      id,
    });

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    return url;
  }

  async delete(data: any) {
    await this.findByIdAndUser(data);

    return await this.urlRepository.delete(data.id);
  }

  async update(data: UpdateUrlDto) {
    await this.findByIdAndUser(data);

    return await this.urlRepository.update({ id: data.id, url: data.url });
  }

  async get(code: string) {
    const url = await this.urlRepository.get(code);

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    this.clickRepository.create(url.id);

    return { url: url.url, statusCode: 302 };
  }

  async create(body: CreateUrlDto) {
    let code = this.gerarStringAleatoria();

    const codeFind = await this.urlRepository.get(body.code);

    while (code === codeFind?.code) {
      code = this.gerarStringAleatoria();
    }

    await this.urlRepository.create({
      code,
      url: body.url.includes('https') ? body.url : `https://${body.url}`,
      usuarioId: body.usuarioId,
    });

    return `${this.configService.get('URL')}/${code}`;
  }
}
