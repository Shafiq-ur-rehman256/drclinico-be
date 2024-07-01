import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from 'src/entities/patients.entity';
import { Doctors } from 'src/entities/doctors.entity';
import { Chats } from 'src/entities/chats.entity';
import { Conversations } from 'src/entities/conversation.entity';
import { SharedModule } from 'src/shared/shared.module';
import { GeneralService } from 'src/shared/services/general/general.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patients, Doctors, Chats, Conversations]),
    SharedModule
  ],

  providers: [{
    provide: 'SOCKET-SERVICE',
    useClass: SocketService
  },
  {
    provide: 'GEN-SERVICE',
    useClass: GeneralService
  }
  ],
  
  exports: [{
    provide: 'SOCKET-SERVICE',
    useClass: SocketService
  }
]
})
export class SocketModule { }
