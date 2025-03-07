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
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');

    console.log('📧 SMTP Config:', {
      user,
      pass: pass ? '*******' : '❌ NOT SET',
    });

    if (!user || !pass) {
      console.error(
        '❌ EMAIL_USER or EMAIL_PASS is missing in environment variables',
      );
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP Connection Error:', error);
      } else {
        console.log('✅ SMTP Connection Successful:', success);
      }
    });
  }

  async sendMailWithTemplate(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      console.log(
        `📧 Attempting to send email to: ${to}, using template: ${templateName}`,
      );

      const templatePath = join(
        __dirname,
        '..', // Moves up from 'dist/mail/providers' to 'dist/mail'
        'templates',
        `${templateName}.ejs`,
      );

      console.log(`📂 Resolving email template path: ${templatePath}`);

      let template: string;
      try {
        template = await fs.readFile(templatePath, 'utf-8');
      } catch (error) {
        console.error('❌ Failed to load email template:', error);
        throw new InternalServerErrorException({
          message: 'Failed to load email template',
          description: `Error reading file: ${templatePath}`,
          stack: error.stack,
        });
      }

      let html: string;
      try {
        html = ejs.render(template, data);
      } catch (error) {
        console.error('❌ Failed to render email template:', error);
        throw new InternalServerErrorException({
          message: 'Failed to render email template',
          description: 'Error rendering EJS template.',
          stack: error.stack,
        });
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        html,
      };

      console.log(`📤 Sending email to ${to}...`);

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email successfully sent to ${to}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error);

      throw new InternalServerErrorException({
        message: 'Failed to send email',
        description: `SMTP Error: ${error.message}`,
        stack: error.stack,
        details: error.response || 'No additional error details available.',
      });
    }
  }
}
