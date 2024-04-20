import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { SharedModule } from 'src/shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({

      useFactory:async (config:ConfigService) => ({
        transport:{
          service: 'gmail',
          // host: process.env.NODE_MAILER_HOST,
          // port: 465,
          secure: false,
          auth: {
            user: process.env.NODE_MAILER_USER,
            pass: process.env.NODE_MAILER_PASS
          }
        },
        defaults: {
          from: `<${process.env.NODE_MAILER_FROM}>`
        },
        template: {
          dir: join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),

      inject: [ConfigService]
    })
  ],
  providers: [{
    provide: 'MAILER-SERVICE',
    useClass: MailService
  }],
  exports: [{
    provide: 'MAILER-SERVICE',
    useClass: MailService
  }]
})
export class MailModule {}
