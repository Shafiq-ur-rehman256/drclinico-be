import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { SharedModule } from './shared/shared.module';
import { MailModule } from './mail/mail.module';
import entities from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:['.env'],
      isGlobal:true
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
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
