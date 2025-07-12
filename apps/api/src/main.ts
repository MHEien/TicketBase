import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Configure body parser with increased limits for plugin uploads
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

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

  // Enhanced CORS configuration
  const corsConfig = configService.get('security.cors');
  app.enableCors({
    origin: corsConfig.origins,
    credentials: corsConfig.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'x-tenant-id',
      'x-plugin-id',
    ],
    exposedHeaders: ['Content-Length', 'X-Total-Count'],
  });

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('eTickets Platform API')
    .setDescription('The eTickets Platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Get port from config (defined as 4000 in app.config.ts)
  const port = configService.get<number>('port');
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
  console.log(
    `API documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});
