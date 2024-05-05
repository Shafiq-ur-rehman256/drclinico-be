import { Body, Controller, Get, Inject, Post, Put, Request } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AvailableSlotsDto, UpdateDocProfileDto, VerifyOtpDto, authenticateDto, signupDto } from './doctor.dto';
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

    @Put('profile')
    updateDoctorProfile(@Body() body: UpdateDocProfileDto, @Request() req: request){
        return this._doctor.updateDoctorProfile(body, req)
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

    @Get('active/list')
    getAllActiveDoctorList(@Request() req: request){
        return this._doctor.getAllActiveDoctorList(req)
    }

    @Get('available_slots')
    getAllDoctorAvailableSlots(@Request() req: request){
        return this._doctor.getAllDoctorAvailableSlots(req)
    }

    @Post('set/available_slots')
    setAvailableSlot(@Body() body: AvailableSlotsDto, @Request() req: request){
        return this._doctor.setAvailableSlot(body, req);
    }

}
