import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private service: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        this.service.addRequestCounter(
          req.method,
          req.route.path,
          String(res.statusCode),
        );
      }),
      catchError((error) => {
        this.service.addRequestCounter(
          req.method,
          req.route.path,
          String(error.status),
        );

        throw error;
      }),
    );
  }
}
