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

  // Security middleware - add basic security headers
  app.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Remove server header
    res.removeHeader('X-Powered-By');
    
    next();
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Configure body parser with reduced limits for security
  app.use(bodyParser.json({ 
    limit: '5mb', // Reduced from 10mb
    verify: (req, res, buf) => {
      // Basic JSON validation
      if (buf && buf.length > 0) {
        try {
          JSON.parse(buf.toString());
        } catch (e) {
          throw new Error('Invalid JSON');
        }
      }
    }
  }));
  app.use(bodyParser.urlencoded({ 
    limit: '5mb', 
    extended: true,
    parameterLimit: 100 // Limit number of parameters
  }));

  // Setup validation pipe globally with enhanced security
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true, // Changed to true for security
      transformOptions: {
        enableImplicitConversion: true,
      },
      validateCustomDecorators: true, // Changed to true for security
      disableErrorMessages: configService.get('NODE_ENV') === 'production', // Hide validation errors in production
    }),
  );

  // Use cookie-parser middleware
  app.use(cookieParser());

  // Enable CORS with enhanced security
  const allowedOrigins = [
    configService.get('FRONTEND_URL', 'http://localhost:4000'),
    configService.get('ADMIN_URL', 'http://localhost:3000'),
    configService.get('STOREFRONT_URL', 'http://localhost:3001'),
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Tenant-ID',
    ],
    maxAge: 86400, // 24 hours
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
