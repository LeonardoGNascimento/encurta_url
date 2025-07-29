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
import { UrlService } from '../service/url.service';
import { AuthGuard } from 'shared/core/auth.guard';
import { AuthOptionalGuard } from 'shared/core/authOptional.guard';
import { CreateUrlDto } from '../../domain/dto/createUrl.dto';
import { UpdateUrlDto } from '../../domain/dto/updateUrl.dto';

@Controller()
export class UrlController {
  constructor(private service: UrlService) {}

  @UseGuards(AuthGuard)
  @Get()
  list(@Req() req: any) {
    return this.service.list(req.user?.id);
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
