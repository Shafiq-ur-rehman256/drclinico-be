import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { Doctors } from 'src/entities/doctors.entity';
import { Patients } from 'src/entities/patients.entity';
import { Conversations } from 'src/entities/conversation.entity';
import { Chats } from 'src/entities/chats.entity';
import { PatientMiddleware } from 'src/shared/middlewares/patient/patient.middleware';
import { DoctorMiddleware } from 'src/shared/middlewares/doctor/doctor.middleware';
import { Logs } from 'src/entities/logs.entity';
import { Appointments } from 'src/entities/appointment.entity';
import { SocketModule } from 'src/socket/socket.module';
import { SocketService } from 'src/socket/socket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctors, Patients, Conversations, Chats, Logs, Appointments]),
    SharedModule,
    SocketModule
  ],
  controllers: [ChatsController],
  providers: [
    {
      provide: 'CHAT-SERVICE',
      useClass: ChatsService
    },
    {
      provide: 'SOCKET-SERVICE',
      useClass: SocketService
    }
  ]
})
export class ChatsModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PatientMiddleware)
      .forRoutes(
        {
          path: 'chats/patient/conversations',
          method: RequestMethod.GET,
        }
      );

    consumer.apply(DoctorMiddleware)
      .forRoutes(
        {
          path: 'chats/doctor/conversations',
          method: RequestMethod.GET
        },
        // {
        //   path: 'appointment/start',
        //   method: RequestMethod.POST
        // }
      )

  }



}

