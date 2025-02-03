import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './providers/user.service';
import { UsersController } from './users.controller';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { FindUserByGoogleProvider } from './providers/find-user-by-google.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { PatchUserProvider } from './providers/patch-user.provider';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { Otp } from 'src/auth/otp.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressSchema, Address } from './schemas/user-address.schema';
import { CreateUserAddress } from './providers/create-user-address.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UserService,
    CreateUserProvider,
    FindUserByEmailProvider,
    FindUserByGoogleProvider,
    CreateGoogleUserProvider,
    PatchUserProvider,
    CreateUserAddress,
  ],
  exports: [UserService, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(profileConfig),
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
})
export class UsersModule {}
