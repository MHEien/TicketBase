import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Setup validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validateCustomDecorators: false,
    }),
  );

  // Use cookie-parser middleware
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4000',
    credentials: true,
  });

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('eTickets Platform API')
    .setDescription('The eTickets Platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Get port from config (defined as 4000 in app.config.ts)
  const port = configService.get<number>('port');
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
  console.log(
    `API documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
