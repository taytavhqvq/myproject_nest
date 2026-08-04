import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface HttpExceptionResponseBody {
  statusCode: number;
  message?: string;
  error?: string;
}

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse() as HttpExceptionResponseBody | string;

      const message =
        typeof res === 'string' ? res : res.message || 'Something went wrong';

      return response.status(status).json({
        success: false,
        message,
        data: null,
        errors: null,
      });
    }

    // Error ที่ไม่คาดคิด (database error, uncaught exception, etc.)
    console.error(exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong',
      data: null,
      errors: null,
    });
  }
}
