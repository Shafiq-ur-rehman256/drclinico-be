import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Jwt } from 'jsonwebtoken';
import { Logs } from 'src/entities/logs.entity';
import { Patients } from 'src/entities/patients.entity';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import { ResponseService } from 'src/shared/services/response/response.service';
import { Repository } from 'typeorm';

@Injectable()
export class PatientMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Patients) private _patientRepo: Repository<Patients>,
    @InjectRepository(Logs) private _logRepo: Repository<Logs>,
    @Inject('JWT-SERVICE') private _jwt: JwtService,
    @Inject('RES-SERVICE') private _res: ResponseService,
  ) { }
  async use(req: Request, res: Response, next: () => void) {

    try {
      const { authorization } = req.headers;

      if (!authorization) {
        // set log
        const payload = {
          message: "Session Expired",
          route: req.originalUrl,
          status: HttpStatus.UNAUTHORIZED,
          data: null
        }
        const createLog = this._logRepo.create(payload);
        this._logRepo.save(createLog);
        // throw jwt exception
        throw new HttpException("Session Expired", HttpStatus.UNAUTHORIZED)
      }

      const tokenData: any = await this._jwt.decodeToken(authorization);

      if (!tokenData) {
        throw new HttpException("Session Expired", HttpStatus.UNAUTHORIZED)
      }

      const patient = this._patientRepo.findOne({
        where: {
          id: tokenData.id
        }
      })

      if (!patient) {
        throw new HttpException("Session Expired", HttpStatus.UNAUTHORIZED)
      }

      next();
    } catch (error) {
      this._res.generateErr(error, req)
    }

  }
}
