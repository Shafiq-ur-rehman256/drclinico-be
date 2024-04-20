import { Module } from '@nestjs/common';
import { GeneralService } from './services/general/general.service';
import { JwtService } from './services/jwt/jwt.service';
import { ResponseService } from './services/response/response.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from 'src/entities/logs.entity';
import { Patients } from 'src/entities/patients.entity';
import { PatientMiddleware } from './middlewares/patient/patient.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Logs, Patients])
  ],
  providers: [
    {
      provide: 'GEN-SERVICE',
      useClass: GeneralService
    },
    {
      provide: 'JWT-SERVICE',
      useClass: JwtService
    },
    {
      provide: 'RES-SERVICE',
      useClass: ResponseService
    }],
  exports: [
    {
      provide: 'GEN-SERVICE',
      useClass: GeneralService
    },
    {
      provide: 'JWT-SERVICE',
      useClass: JwtService
    },
    {
      provide: 'RES-SERVICE',
      useClass: ResponseService
    }
  ]
})
export class SharedModule { }
