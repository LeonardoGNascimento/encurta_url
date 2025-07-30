import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  registry: Registry | null;
  private httpRequestCounter: Counter | null;

  onModuleInit() {
    if (this.configService.get('METRICS') === 'true') {
      this.registry = new Registry();
      collectDefaultMetrics({ register: this.registry });

      this.httpRequestCounter = new Counter({
        name: 'http_requests_total',
        help: 'Total de requisições HTTP',
        labelNames: ['method', 'route', 'status'],
      });

      this.registry.registerMetric(this.httpRequestCounter);
    }
  }

  addRequestCounter(method: string, route: string, status: string) {
    if (this.httpRequestCounter) {
      this.httpRequestCounter.labels(method, route, status).inc();
    }
  }
}
