import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
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
import { UpdateUrlDto } from './dominio/dto/updateUrl.dto';

@Controller()
export class AppController {
  constructor(private service: AppService) {}

  @UseGuards(AuthGuard)
  @Get()
  getHello(@Req() req: any) {
    return this.service.getHello(req.user?.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: number) {
    return this.service.delete({ usuarioId: req.user?.id, id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Req() req: any, @Param('id') id: number, @Body() body: UpdateUrlDto) {
    return this.service.update({ ...body, usuarioId: req.user?.id, id });
  }

  @Get(':code')
  @Redirect()
  @HttpCode(302)
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
      url: code,
    };
  }
}
