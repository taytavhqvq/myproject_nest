import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

interface ValidationErrorItem {
  field: string;
  message: string;
}

interface ExceptionResponseBody {
  statusCode: number;
  message: string | ValidationErrorItem[];
  error?: string;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const res = exception.getResponse() as ExceptionResponseBody | string;

    if (typeof res === 'object' && Array.isArray(res.message)) {
      return response.status(status).json({
        success: false,
        message: 'Validation failed',
        data: null,
        errors: res.message,
      });
    }
    const message =
      typeof res === 'string' ? res : res.message || 'Bad request';

    return response.status(status).json({
      success: false,
      message,
      data: null,
      errors: null,
    });
  }
}
