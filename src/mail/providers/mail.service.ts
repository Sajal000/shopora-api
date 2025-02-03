/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendMailWithTemplate(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      const templatePath = join(
        process.env.NODE_ENV === 'production' ? __dirname : 'src/mail',
        'templates',
        `${templateName}.ejs`,
      );
      const template: string = await fs.readFile(templatePath, 'utf-8');

      const html: string = ejs.render(template, data);

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred while sending the email.';
      if (error instanceof Error) {
        errorMessage = error.message.split(':')[0];
      }

      console.error('Error sending email: ', errorMessage);
      throw new InternalServerErrorException({
        message: 'Failed to send email',
        description: `Error: ${errorMessage}`,
      });
    }
  }
}
