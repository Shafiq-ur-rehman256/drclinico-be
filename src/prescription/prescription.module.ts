import { Module } from '@nestjs/common';
import { PrescriptionController } from './prescription.controller';
import { PrescriptionService } from './prescription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from 'src/entities/prescription.entity';
import { PrescriptionDetail } from 'src/entities/prescriptionDetail.eneitiy';
import { SharedModule } from 'src/shared/shared.module';
import { Doctors } from 'src/entities/doctors.entity';
import { Patients } from 'src/entities/patients.entity';
import { Logs } from 'src/entities/logs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctors,
      Patients,
      Logs,
      Prescription,
      PrescriptionDetail
    ]),
    SharedModule
  ],
  controllers: [PrescriptionController],
  providers: [
    {
      provide: 'PRESCRIPTION-SERVICE',
      useClass: PrescriptionService
    }
  ]
})
export class PrescriptionModule { }
