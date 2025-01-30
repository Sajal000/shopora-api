import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataResponseInterceptor<T = any> implements NestInterceptor {
  constructor(
    /**
     * Inject configService
     */
    private readonly configService: ConfigService,
  ) {}

  /**
   * Intercepts responses and adds an API version field
   * @param context - The execution context
   * @param next - The next handler in the request pipeline
   * @returns Observable<T>
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ apiVersion: string; data: T }> {
    return next.handle().pipe(
      map((data: T) => ({
        apiVersion: this.configService.get<string>(
          'appConfig.apiVersion',
          '0.1.1',
        ), // Default version added
        data,
      })),
    );
  }
}
