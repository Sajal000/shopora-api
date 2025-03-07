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

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
    });
  }

  async sendMailWithTemplate(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      const possiblePaths = [
        join(process.cwd(), 'dist', 'mail', 'templates', `${templateName}.ejs`),

        join(
          process.cwd(),
          'dist',
          'src',
          'mail',
          'templates',
          `${templateName}.ejs`,
        ),

        join(process.cwd(), 'src', 'mail', 'templates', `${templateName}.ejs`),

        join(__dirname, '..', '..', 'mail', 'templates', `${templateName}.ejs`),
      ];

      let template: string;
      let templatePath;
      try {
        let fileFound = false;

        for (const path of possiblePaths) {
          try {
            await fs.access(path);
            templatePath = path;
            fileFound = true;
            break;
          } catch (error) {
            throw new InternalServerErrorException({
              message: (error as Error).message.split(':')[0],
              description: `Error reading file: ${templatePath}`,
            });
          }
        }

        if (!fileFound) {
          throw new Error(
            `Template '${templateName}.ejs' not found in any of the expected locations`,
          );
        }

        template = await fs.readFile(templatePath, 'utf-8');
      } catch (error) {
        throw new InternalServerErrorException({
          message: (error as Error).message.split(':')[0],
          description: `Error reading file: ${templatePath}`,
        });
      }

      let html: string;
      try {
        html = ejs.render(template, data);
      } catch (error) {
        throw new InternalServerErrorException({
          message: (error as Error).message.split(':')[0],
          description: 'Error rendering EJS template.',
        });
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `SMTP Error: ${error.message}`,
      });
    }
  }
}
