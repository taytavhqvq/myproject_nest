import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept<T>(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{
    success: boolean;
    message: string;
    data: T;
    errors: null;
  }> {
    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        message: 'Operation successful',
        data,
        errors: null,
      })),
    );
  }
}
