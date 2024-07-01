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
import { DoctorMiddleware } from 'src/shared/middlewares/doctor/doctor.middleware';
import { DoctorAvailableSlots } from 'src/entities/doctorAvailableSlots.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctors,
      Patients,
      Logs,
      DoctorAvailableSlots
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
        path: 'doctor/active/list',
        method: RequestMethod.GET,
      });

    consumer
    .apply(DoctorMiddleware)
    .forRoutes({
      path: 'doctor/set/available_slots',
      method: RequestMethod.POST
    })
  }

  


}
