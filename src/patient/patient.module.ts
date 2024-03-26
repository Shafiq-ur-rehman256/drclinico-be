import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from 'src/entities/patients.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patients]),
    MailModule,
    SharedModule
  ],
  controllers: [PatientController],
  providers: [{
    provide: 'PATIENT-SERVICE',
    useClass: PatientService
  }],
  
})
export class PatientModule {}
