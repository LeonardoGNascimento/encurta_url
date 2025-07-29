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
  UseGuards,
} from '@nestjs/common';
import { User } from 'apps/user/src/domain/entity/user.entity';
import { AuthGuard } from 'shared/core/auth.guard';
import { AuthOptionalGuard } from 'shared/core/authOptional.guard';
import { GetUser } from 'shared/core/getUser.decorator';
import { CreateUrlDto } from '../../domain/dto/createUrl.dto';
import { ListUrlsReturnDto } from '../../domain/dto/listUrls.return.dto';
import { UpdateUrlDto } from '../../domain/dto/updateUrl.dto';
import { UrlService } from '../service/url.service';

@Controller()
export class UrlController {
  constructor(private service: UrlService) {}

  @UseGuards(AuthGuard)
  @Get()
  list(@GetUser() user: User): Promise<ListUrlsReturnDto[]> {
    return this.service.list(user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@GetUser() user: User, @Param('id') id: number): Promise<boolean> {
    return this.service.delete({ userId: user.id, id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() body: UpdateUrlDto,
  ): Promise<boolean> {
    return this.service.update({ ...body, userId: user.id, id });
  }

  @Get(':code')
  @Redirect()
  @HttpCode(302)
  get(@Param('code') code: string) {
    return this.service.get(code);
  }

  @UseGuards(AuthOptionalGuard)
  @Post()
  create(@GetUser() user: User, @Body() body: CreateUrlDto) {
    return this.service.create({
      ...body,
      usuarioId: user?.id,
    });
  }
}
