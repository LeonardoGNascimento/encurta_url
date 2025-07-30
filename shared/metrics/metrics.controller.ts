import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private service: MetricsService) {}

  @Get()
  async metrics(@Res() res: Response) {
    res.set('Content-Type', this.service.registry.contentType);
    res.send(await this.service.registry.metrics());
  }
}
