import { Body, Controller, Get, Inject, Param, Post, Request } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Request as request } from 'express';
import { BookAppointmentDto, StartAppointmentDto } from './appointment.dto';

@Controller('appointment')
export class AppointmentController {

    constructor(
        @Inject('APPOINTMENT-SERVICE') private _appointment: AppointmentService
    ){}

    @Get('patient/doctor/list')
    getAllDoctorListForPatient(@Request() req: request){
        return this._appointment.getAllDoctorListForPatient(req);
    }

    @Get('available_slots/:doctor_id')
    getDoctorAvailableSlots(@Param('doctor_id') doctor_id: string, @Request() req: request){
        return this._appointment.getDoctorAvailableSlots(doctor_id, req);
    }

    @Post('book')
    bookAppointmentForPatient(@Body() body: BookAppointmentDto, @Request() req: request){
        return this._appointment.bookAppointmentForPatient(body, req);
    }

    @Get('doctor/patient_appointments')
    patientAppointmentsForDoctor(@Request() req: request){
        return this._appointment.patientAppointmentsForDoctor(req)
    }

    @Post('start')
    startAppointment(@Body() body: StartAppointmentDto, @Request() req: request){
        return this._appointment.startAppointment(body, req)
    }
}
