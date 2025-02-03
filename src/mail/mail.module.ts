import { Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
