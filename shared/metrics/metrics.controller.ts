import {
  Controller,
  Get,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private service: MetricsService) {}

  @Get()
  async metrics(@Res() res: Response) {
    if (!this.service.registry) {
      throw new ServiceUnavailableException('Metrics are disabled');
    }

    res.set('Content-Type', this.service.registry.contentType);
    res.send(await this.service.registry.metrics());
  }
}
