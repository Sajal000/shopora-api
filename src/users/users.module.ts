import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './providers/user.service';
import { UsersController } from './users.controller';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { FindUserByGoogleProvider } from './providers/google-providers/find-user-by-google.provider';
import { CreateGoogleUserProvider } from './providers/google-providers/create-google-user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { PatchUserProvider } from './providers/patch-user.provider';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { Otp } from 'src/auth/entities/otp.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressSchema, Address } from './schemas/user-address.schema';
import { CreateUserAddressProvider } from './providers/address-providers/create-user-address.provider';
import { PatchUserAddressProvider } from './providers/address-providers/patch-user-address.provider';
import { MailModule } from 'src/mail/mail.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [UsersController],
  providers: [
    UserService,
    CreateUserProvider,
    FindUserByEmailProvider,
    FindUserByGoogleProvider,
    CreateGoogleUserProvider,
    PatchUserProvider,
    CreateUserAddressProvider,
    PatchUserAddressProvider,
  ],
  exports: [UserService, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(profileConfig),
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    forwardRef(() => MailModule),
    PaginationModule,
  ],
})
export class UsersModule {}
