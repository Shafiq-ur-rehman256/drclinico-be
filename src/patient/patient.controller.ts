import { Body, Controller, Inject, Post, Put, Request } from '@nestjs/common';
import { PatientService } from './patient.service';
import { Request as request } from 'express';
import { AuthenticatePatientDto, PatientSignUpDto, PatientVerificationDto } from './patient.dto';

@Controller('patient')
export class PatientController {
    constructor(
        @Inject('PATIENT-SERVICE') private _patient: PatientService
    ){}

    @Post('signup')
    patientSignUp(@Body() body: PatientSignUpDto, @Request() req: request){
        return this._patient.patientSignUp(body, req)
    }

    @Put('verify-otp')
    patientOtpVerification(@Body() body: PatientVerificationDto, @Request() req: request){
        return this._patient.patientOtpVerification(body, req);
    }

    @Put('authenticate')
    authenticatePatient(@Body() body:AuthenticatePatientDto, @Request() req: request){
        // console.log("run", body);
        return this._patient.authenticatePatient(body, req);
    }
}
