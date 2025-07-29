import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUrlDto } from '../../domain/dto/createUrl.dto';
import { CreateUrlReturnDto } from '../../domain/dto/createUrl.return.dto';
import { DeleteUrlDto } from '../../domain/dto/deleteUrl.dto';
import { FindByIdAndUserDto } from '../../domain/dto/findByIdAndUser.dto';
import { GetUrlReturnDto } from '../../domain/dto/getUrl.return.dto';
import { ListUrlsReturnDto } from '../../domain/dto/listUrls.return.dto';
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

  async list(usuarioId: number): Promise<ListUrlsReturnDto[]> {
    return this.urlRepository.list(usuarioId);
  }

  async findByIdAndUser({ userId, id }: FindByIdAndUserDto) {
    const url = await this.urlRepository.findByIdAndUser({
      userId,
      id,
    });

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    return url;
  }

  async delete(data: DeleteUrlDto): Promise<boolean> {
    await this.findByIdAndUser(data);
    return await this.urlRepository.delete(data.id);
  }

  async update(data: UpdateUrlDto): Promise<boolean> {
    await this.findByIdAndUser({
      id: data.id,
      userId: data.userId,
    });

    return await this.urlRepository.update({ id: data.id, url: data.url });
  }

  async get(code: string): Promise<GetUrlReturnDto> {
    const url = await this.urlRepository.get(code);

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    this.clickRepository.create(url.id);

    return { url: url.url, statusCode: 302 };
  }

  async create(body: CreateUrlDto): Promise<CreateUrlReturnDto> {
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

    return { url: `${this.configService.get('URL')}/${code}` };
  }
}
