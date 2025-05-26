import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Configure logger to show debug messages
  const logger = new Logger('Bootstrap');

  // Create the application with verbose logging enabled
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  logger.log('Application bootstrapping with debug logging enabled');

  // Enable CORS for the NextJS frontends
  const allowedOrigins = [
    configService.get('NEXT_PUBLIC_STOREFRONT_URL', 'http://localhost:3000'),
    configService.get('NEXT_PUBLIC_ADMIN_URL', 'http://localhost:4000'),
  ];

  logger.log(`Configured CORS for origins: ${allowedOrigins.join(', ')}`);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-tenant-id',
      'x-plugin-id',
      'accept',
    ],
  });

  // Add global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set up Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Plugin Server API')
    .setDescription('API documentation for the Plugin Server')
    .setVersion('1.0')
    .addTag('plugins')
    .addTag('marketplace')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT', 5000);
  await app.listen(port);
  logger.log(`Plugin server is running on: ${await app.getUrl()}`);
  logger.log(
    `Swagger documentation available at: ${await app.getUrl()}/api/docs`,
  );
}
bootstrap();
