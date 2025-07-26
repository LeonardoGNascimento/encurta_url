import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { AuthGuard } from './core/auth.guard';
import { AuthOptionalGuard } from './core/authOptional.guard';
import { gerarStringAleatoria } from './core/generateCode';
import { Url } from './url.entity';

@Controller()
export class AppController {
  constructor(@InjectRepository(Url) private urlRepository: Repository<Url>) {}

  @UseGuards(AuthGuard)
  @Get()
  getHello(@Req() req: Request) {
    return this.urlRepository.find({
      where: {
        usuario: {
          id: req.user?.id,
        },
      },
    });
  }

  @Get(':code')
  @Redirect()
  async get(@Param('code') code: string) {
    const url = await this.urlRepository.findOneByOrFail({
      code,
    });

    return { url: url.url, statusCode: 301 };
  }

  @UseGuards(AuthOptionalGuard)
  @Post()
  async create(@Req() req: Request, @Body() body: any) {
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
      usuarioId: req.user?.id,
    });

    return {
      url:
        req.hostname === 'localhost'
          ? `${req.hostname}:${req.socket.localPort}/${code}`
          : `${req.hostname}/${code}`,
    };
  }
}
