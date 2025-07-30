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
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../../../../../shared/core/auth.guard';
import { AuthOptionalGuard } from '../../../../../shared/core/authOptional.guard';
import { GetUser } from '../../../../../shared/core/getUser.decorator';
import { MetricsInterceptor } from '../../../../../shared/metrics/metrics.interceptor';
import { CreateUrlDto } from '../../domain/dto/createUrl.dto';
import { ListUrlsReturnDto } from '../../domain/dto/listUrls.return.dto';
import { UpdateUrlDto } from '../../domain/dto/updateUrl.dto';
import { UrlService } from '../service/url.service';

@UseInterceptors(MetricsInterceptor)
@Controller()
export class UrlController {
  constructor(private service: UrlService) {}

  @UseGuards(AuthGuard)
  @Get()
  list(@GetUser() user): Promise<ListUrlsReturnDto[]> {
    return this.service.list(user.id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async delete(@GetUser() user, @Param('id') id: number): Promise<void> {
    await this.service.delete({ userId: user.id, id });
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch(':id')
  async update(
    @GetUser() user,
    @Param('id') id: number,
    @Body() body: UpdateUrlDto,
  ): Promise<void> {
    await this.service.update({ ...body, userId: user.id, id });
  }

  @Get(':code')
  @Redirect()
  @HttpCode(302)
  get(@Param('code') code: string) {
    return this.service.get(code);
  }

  @UseGuards(AuthOptionalGuard)
  @Post()
  create(@GetUser() user, @Body() body: CreateUrlDto) {
    return this.service.create({
      ...body,
      userId: user?.id,
    });
  }
}
