import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appCreate(app);

  app.enableCors({
    origin: 'http://localhost:3500',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
