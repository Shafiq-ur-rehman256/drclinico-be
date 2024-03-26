import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctors } from 'src/entities/doctors.entity';
import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Doctors
    ]),
    SharedModule,
    MailModule
  ],
  controllers: [DoctorController],
  providers: [{
    provide: 'DOCTOR-SERVICE',
    useClass: DoctorService
  }]
})
export class DoctorModule {}
