import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './provider/user.service';
import { UsersController } from './users.controller';
import { CreateUserProvider } from './provider/create-user.provider';
import { FindUserByEmailProvider } from './provider/find-user-by-email.provider';
import { FindUserByGoogleProvider } from './provider/find-user-by-google.provider';
import { CreateGoogleUserProvider } from './provider/create-google-user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { PatchUserProvider } from './provider/patch-user.provide';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';

@Module({
  controllers: [UsersController],
  providers: [
    UserService,
    CreateUserProvider,
    FindUserByEmailProvider,
    FindUserByGoogleProvider,
    CreateGoogleUserProvider,
    PatchUserProvider,
  ],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
