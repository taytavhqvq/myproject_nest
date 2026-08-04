import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const METHOD_MESSAGES: Record<string, string> = {
  GET: 'Fetch successful',
  POST: 'Create successful',
  PATCH: 'Update successful',
  PUT: 'Update successful',
  DELETE: 'Delete successful',
};

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<{ method: string }>();
    const message = METHOD_MESSAGES[request.method] || 'Operation successful';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
        errors: null,
      })),
    );
  }
}
