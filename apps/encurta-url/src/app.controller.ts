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

import { Request } from 'express';
import { AuthGuard } from '../../../shared/core/auth.guard';
import { AuthOptionalGuard } from '../../../shared/core/authOptional.guard';
import { AppService } from './app.service';
import { CreateUrlDto } from './dominio/dto/createUrl.dto';

@Controller()
export class AppController {
  constructor(private service: AppService) {}

  @UseGuards(AuthGuard)
  @Get()
  getHello(@Req() req: any) {
    return this.service.getHello(req.user?.id);
  }

  @Get(':code')
  @Redirect()
  get(@Param('code') code: string) {
    return this.service.get(code);
  }

  @UseGuards(AuthOptionalGuard)
  @Post()
  async create(@Req() req: any, @Body() body: CreateUrlDto) {
    const code = await this.service.create({
      ...body,
      usuarioId: req?.user?.id,
    });

    return {
      url:
        req.hostname === 'localhost'
          ? `${req.hostname}:${req.socket.localPort}/${code}`
          : `${req.hostname}/${code}`,
    };
  }
}
