import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { ResponseInterceptor } from './common/interceptors/response.interceptors';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { GeneralExceptionFilter } from './common/filters/general-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.flatMap((err) =>
          Object.values(err.constraints || {}).map((message) => ({
            field: err.property,
            message,
          })),
        );
        return new BadRequestException(formattedErrors);
      },
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  app.useGlobalFilters(
    new GeneralExceptionFilter(),
    new ValidationExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// nest g res users
