import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctors } from 'src/entities/doctors.entity';
import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/mail/mail.module';
import { PatientMiddleware } from 'src/shared/middlewares/patient/patient.middleware';
import { Patients } from 'src/entities/patients.entity';
import { Logs } from 'src/entities/logs.entity';
import { DoctorProfile } from 'src/entities/doctorProfile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctors,
      Patients,
      Logs,
       DoctorProfile
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
export class DoctorModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PatientMiddleware)
      .forRoutes({
        path: 'active/list',
        method: RequestMethod.GET,
      });
  }


}
