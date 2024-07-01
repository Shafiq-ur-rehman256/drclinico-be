import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctors } from 'src/entities/doctors.entity';
import { PatientMiddleware } from 'src/shared/middlewares/patient/patient.middleware';
import { Patients } from 'src/entities/patients.entity';
import { Logs } from 'src/entities/logs.entity';
import { Appointments } from 'src/entities/appointment.entity';
import { DoctorMiddleware } from 'src/shared/middlewares/doctor/doctor.middleware';
import { Conversations } from 'src/entities/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctors, Patients, Logs, Appointments, Conversations]),
    SharedModule,
  ],
  controllers: [AppointmentController],
  providers: [{
    provide: 'APPOINTMENT-SERVICE',
    useClass: AppointmentService
  }]
})
export class AppointmentModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PatientMiddleware)
      .forRoutes(

      {
        path: 'appointment/patient/doctor/list',
        method: RequestMethod.GET,
      },
      {
        path: 'appointment/available_slots/:doctor_id',
        method: RequestMethod.GET
      },
      {
        path: 'appointment/book',
        method: RequestMethod.POST
      }
    );

    consumer.apply(DoctorMiddleware)
    .forRoutes(
      {
        path: 'appointment/doctor/patient_appointments',
        method: RequestMethod.GET
      },
      {
        path: 'appointment/start',
        method: RequestMethod.POST
      }
    )

  }
  


}
