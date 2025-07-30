import { OnModuleInit } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

export class MetricsService implements OnModuleInit {
  registry: Registry;

  private httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total de requisições HTTP',
    labelNames: ['method', 'route', 'status'],
  });

  onModuleInit() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });
    this.registry.registerMetric(this.httpRequestCounter);
  }

  addRequestCounter(method: string, route: string, status: string) {
    this.httpRequestCounter.labels(method, route, status).inc();
  }
}
