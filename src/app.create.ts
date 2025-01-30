import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configures Swagger UI for the application
 * @param app - The NestJS application instance
 */
export function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation with JWT authentication')
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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'refresh-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
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
    }),
  );

  configureSwagger(app); // ✅ Apply Swagger configuration

  Logger.log('Application setup complete', 'Bootstrap');
}
