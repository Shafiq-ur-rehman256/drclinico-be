import { Body, Controller, Get, Inject, Post, Request } from '@nestjs/common';
import { Request as request } from 'express';
import { AssignPrescriptionDto } from './prescription.dto';
import { PrescriptionService } from './prescription.service';

@Controller('prescription')
export class PrescriptionController {

    constructor(
        @Inject('PRESCRIPTION-SERVICE') private _prescription: PrescriptionService
    ){}

    @Post('')
    assignPrescription(@Body() body: AssignPrescriptionDto, @Request() req: request){
        return this._prescription.assignPrescription(body, req);
    }

    @Get('')
    getAllprescriptionForDoctor(@Request() req: request){
        return this._prescription.getAllprescriptionForDoctor(req)
    }

}
