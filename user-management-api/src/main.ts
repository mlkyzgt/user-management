import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Angular uygulamasından gelen isteklere izin veriyor.
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // DTO'lardaki validasyon kurallarının bütün endpointlerde çalışmasını sağlar.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.flatMap((error) => {
          if (error.constraints?.whitelistValidation) {
            return [`${error.property} alanı gönderilemez.`];
          }

          return Object.values(error.constraints ?? {});
        });

        return new BadRequestException(messages);
      },
    }),
  );

  // Uygulama açılırken PostgreSQL bağlantısını başlatıyor.
  const db = app.get('PG_CONNECTION');
  await db.connect();

  const result = await db.query('SELECT NOW()');
  console.log('DB CONNECTED:', result.rows);

  await app.listen(3000);
}
bootstrap();
