import { Injectable, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { SharedModule } from './shared/shared.module';
import { MailModule } from './mail/mail.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ChatsModule } from './chats/chats.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DonationsModule } from './donations/donations.module';
import entities from './entities';
import { LoggerModule } from 'nestjs-pino';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NANE,
      entities: [...entities],
      synchronize: process.env.DB_SYNC == 'ON' ? true : false,
    }),
    DoctorModule,
    PatientModule,
    SharedModule,
    MailModule,
    AppointmentModule,
    ChatsModule,
    NotificationsModule,
    DonationsModule,
    MorganModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    }],
})
export class AppModule { }
