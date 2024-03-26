import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Logs } from 'src/entities/logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResponseService {
    constructor(

        @InjectRepository(Logs) private _logRepo: Repository<Logs>

    ) { }


    generateRes(status: number, data: any, message: string, req: Request) {

        const { originalUrl } = req;
        const payload = {
            message: message,
            route: originalUrl,
            status: status,
            data: JSON.stringify(data)
        }
        const createLog = this._logRepo.create(payload);
        this._logRepo.save(createLog);

        if (status == 200) {
            const response = {
                code: status,
                msg: message,
                data: data
            }

            return response
        } else {
            throw new HttpException(message, status)
        }

    }


    generateErr(error: any, req: Request) {

        const { originalUrl } = req;
        const payload = {
            message: error.message,
            route: originalUrl,
            status: 500,
        }
        const createLog = this._logRepo.create(payload);
        this._logRepo.save(createLog)

        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);

    }


}
