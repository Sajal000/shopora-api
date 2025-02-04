import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';
import { AuthService } from './providers/auth.service';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { SendOtpProvider } from './providers/send-otp.provider';
import { VerifyOtpProvider } from './providers/verify-otp.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { MailModule } from 'src/mail/mail.module';
import { ForgotPassword } from './providers/forgot-password.provider';
import { UpdatePassword } from './providers/update-password.provider';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';

@Module({
  controllers: [AuthController, GoogleAuthenticationController],
  providers: [
    AuthService,
    GoogleAuthenticationService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
    SendOtpProvider,
    VerifyOtpProvider,
    ForgotPassword,
    UpdatePassword,
    AccessTokenGuard,
    AuthenticationGuard,
  ],
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Otp]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    forwardRef(() => MailModule),
  ],
  exports: [
    AuthService,
    HashingProvider,
    GoogleAuthenticationService,
    SendOtpProvider,
    VerifyOtpProvider,
    AuthenticationGuard,
    AccessTokenGuard,
  ],
})
export class AuthModule {}
