import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configures Swagger UI for the application
 * @param app - The NestJS application instance
 */
export function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Shopora API')
    .setDescription('API documentation for Shopora')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: false,
    },
  });

  Logger.log('Swagger documentation is available at /api/docs', 'Swagger');
}

/**
 * Sets up global configurations for the application
 * @param app - The NestJS application instance
 */
export function appCreate(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  configureSwagger(app);
  // app.enableCors(); // Removed to prevent overriding the specific CORS configuration in main.ts

  Logger.log('Application setup complete', 'Bootstrap');
}
