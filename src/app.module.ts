import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentSchema from './config/environment.validation';
import jwtConfig from './auth/config/jwt.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response.interceptor';
import { MailService } from './mail/providers/mail.service';
import { MailModule } from './mail/mail.module';
import { PostModule } from './posts/post.module';
import { PostController } from './posts/posts.controller';
import { TagsModule } from './tags/tags.module';
import { ImagesModule } from './images/images.module';
import { VerifiedUserGuard } from './auth/guards/account-verification/verified-user.guard';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { PaymentModule } from './payment/payment.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? `.env` : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentSchema,
    }),

    // PostgreSQL Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
        synchronize: configService.get<boolean>('database.synchronize'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        host: configService.get<string>('database.host'),
        database: configService.get<string>('database.name'),
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    // MongoDB Configuration
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    UsersModule,
    AuthModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MailModule,
    PostModule,
    TagsModule,
    ImagesModule,
    ChatModule,
    PaymentModule,
  ],
  controllers: [AppController, PostController, ChatController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: VerifiedUserGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    AccessTokenGuard,
    MailService,
  ],
})
export class AppModule {}
