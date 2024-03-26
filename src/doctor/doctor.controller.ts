import { Body, Controller, Inject, Post, Put, Request } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { VerifyOtpDto, authenticateDto, signupDto } from './doctor.dto';
import { Request as request } from 'express';

@Controller('doctor')
export class DoctorController {

    constructor(
        @Inject('DOCTOR-SERVICE') private _doctor: DoctorService
    ){}

    @Post('signup')
    doctorSignup(@Body() body: signupDto, @Request() req: request){
        return this._doctor.doctorSignup(body, req);
    }

    @Put('authenticate')
    doctorAuthenticate(@Body() body: authenticateDto, @Request() req: request){
        console.log("run");
        return this._doctor.doctorAuthenticate(body, req)
    }

    @Post('verify-otp')
    verifyDoctorOtp(@Body() body: VerifyOtpDto, @Request() req: request){
        return this._doctor.verifyDoctorOtp(body, req);
    }

}
